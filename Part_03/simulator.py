from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
import base64
import re

BASE_URL = "https://www.verkkokauppa.com/"

class Simulator(webdriver.Chrome):
    def __init__(self):
        chrome_options = Options()
        chrome_options.add_argument("--log-level=3")
        super().__init__(options=chrome_options)

    def restart(self):
        self.get(BASE_URL)
        self._dismiss_cookie_banner()

    def init(self, url=BASE_URL):
        self.get(url)
        self._dismiss_cookie_banner()

    def _dismiss_cookie_banner(self):
        """Dismiss cookie consent banner if present."""
        try:
            wait = WebDriverWait(self, 5)
            host = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#usercentrics-cmp-ui")))

            shadow_root = host.shadow_root

            accept_btn = WebDriverWait(shadow_root, 10).until(
                lambda sr: sr.find_element(By.CSS_SELECTOR, "button#accept, button[data-action-type='accept'], button.uc-accept-button")
            )
            accept_btn.click()
        except Exception:
            pass 

    def crawl(self):
        js_file_path = "script/html_extractor.js"
        with open(js_file_path, "r") as js_file:
            js_content = js_file.read()
            js_script = f"""
            {js_content}
            return toJSONWithHeadTags(document.getElementsByTagName("BODY")[0]);
            """
        html = self.execute_script(js_script)
        return html

    def get_clickables(self):
        js_file_path = "script/clickable_extractor.js"

        with open(js_file_path, "r") as js_file:
            js_content = js_file.read()

        js_script = f"""
        {js_content}
        """

        parameters = {
            "expression": js_script,
            "includeCommandLineAPI": True,
            "returnByValue": True,
        }

        html = self.execute_cdp_cmd("Runtime.evaluate", parameters)
        return html['result']['value']

    def set_highlight_clickable(self, clickables):
        for clickable in clickables:
            element = self.find_element(By.XPATH, clickable['xpath'])
            self.execute_script("arguments[0].setAttribute('style','border: 2px dashed red;');", element)

    def clear_highlight_clickable(self, clickables):
        for clickable in clickables:
            element = self.find_element(By.XPATH, clickable['xpath'])
            self.execute_script("arguments[0].setAttribute('style','');", element)

    def get_screenshot_url(self):
        screenshot = self.find_element(By.TAG_NAME, 'body').screenshot_as_png
        data = base64.b64encode(screenshot).decode()
        return f'data:image/png;base64,{data}'

    def get_screenshot_base64(self):
        screenshot = self.find_element(By.TAG_NAME, 'body').screenshot_as_png
        data = base64.b64encode(screenshot).decode()
        return data

    def get_element_by_xpath(self, xpath):
        return self.find_element(By.XPATH, xpath)

    def visualize_clickables(self, clickables):
        js_file_path = "script/visualize_clickable.js"
        with open(js_file_path, "r") as js_file:
            js_content = js_file.read()
        self.execute_script(f"{js_content}\n visualizeClickable(arguments[0]);", clickables)

    def clear_visualize_clickables(self):
        js_file_path = "script/visualize_clickable.js"
        with open(js_file_path, "r") as js_file:
            js_content = js_file.read()
        self.execute_script(f"{js_content}\n clearClickableOverlays();")
