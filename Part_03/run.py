import json
import os
import time
from simulator import Simulator
from core.agent import GPTVisionAgent
from core.action import ClickAction, InputAction

BASE_URL = "https://www.verkkokauppa.com/"

def build_system_prompt(task: str) -> str:
    return f"""You are a web automation agent navigating a real e-commerce website.
Your goal is: {task}
You will be given a screenshot of the current page and a list of clickable elements with their index.
Respond ONLY with a JSON object in this format:
{{
    "action": "click" | "input",
    "index": <int>,         
    "text": "<string>",     
    "reason": "<string>"    
}}
- Use "click" for buttons, links, menus.
- Use "input" for text fields (include "text" field).
- "index" must match the clickable element index shown in the screenshot overlay.
"""

def run(task: str, max_steps: int = 10):
    simulator = Simulator()
    agent = GPTVisionAgent(model="gpt-4o", temperature=0.0)

    print(f"[START] Task: {task}")
    simulator.init(BASE_URL)

    conversation_history = []

    for step in range(max_steps):
        print(f"\n[STEP {step + 1}/{max_steps}]")

        # Get clickables and visualize them on page
        time.sleep(1000)
        clickables = simulator.get_clickables()
        print(clickables[5])
        if not clickables:
            print("[WARN] No clickables found, stopping.")
            break

        simulator.visualize_clickables(clickables)

        # Capture screenshot with overlays
        screenshot_b64 = simulator.get_screenshot_base64()

        # Build prompt with clickable list
        clickable_summary = "\n".join(
            [f"[{i}] {c.get('text', '')} | tag: {c.get('tag', '')} | xpath: {c.get('xpath', '')}"
             for i, c in enumerate(clickables)]
        )

        print(f"[DEBUG] Clickable summary:\n{clickable_summary}")

        prompt = f"""Step {step + 1}.
Current URL: {simulator.current_url}

Clickable elements:
{clickable_summary}

Task: {task}

Choose the best action to progress toward the goal.
"""

        # Add system prompt only on first step
        if step == 0:
            conversation_history.append({
                "role": "system",
                "content": build_system_prompt(task)
            })

        # Add user message with screenshot
        user_message = agent.build_message("user", prompt, screenshot_b64)
        conversation_history.append(user_message)

        # Get agent decision
        response = agent.run_with_history(conversation_history)
        print(f"[AGENT RESPONSE]\n{response}")

        # Append assistant response to history
        conversation_history.append({
            "role": "assistant",
            "content": response
        })

        # Parse action
        try:
            decision = json.loads(response)
        except json.JSONDecodeError:
            # Try extracting JSON from markdown code block
            import re
            match = re.search(r'```json\s*(.*?)\s*```', response, re.DOTALL)
            if match:
                decision = json.loads(match.group(1))
            else:
                print("[ERROR] Could not parse agent response as JSON, stopping.")
                break

        action_type = decision.get("action")
        index       = decision.get("index")
        text        = decision.get("text", "")
        reason      = decision.get("reason", "")

        print(f"[ACTION] {action_type} on index {index} | reason: {reason}")
        target = clickables
        print(target)
        element = simulator.get_element_by_xpath(target['xpath'])
        print(target['xpath'])

        # Perform action
        try:
            target = clickables[index]
            element = simulator.get_element_by_xpath(target['xpath'])
            print(target['xpath'])

            if action_type == "click":
                action = ClickAction(element)
                action.perform(simulator)
            elif action_type == "input":
                action = InputAction(element, text)
                action.perform(simulator)
            else:
                print(f"[WARN] Unknown action type: {action_type}")
                break

        except (IndexError, Exception) as e:
            print(f"[ERROR] Failed to perform action: {e}")
            break

        # Clear overlays after action
        simulator.clear_visualize_clickables()

    print("\n[DONE] Task run complete.")
    simulator.quit()


if __name__ == "__main__":
    task = "Search for 'laptop' and open the first product result"
    run(task, max_steps=10)