from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from error import CannotPerformActionError
from abc import abstractmethod
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import ElementClickInterceptedException, ElementNotInteractableException, TimeoutException,StaleElementReferenceException

class Action:
    def __init__(self, xpath, description = None, description_detail = None):
        self.xpath = xpath
        self.description = description
        self.description_detail = description_detail

    @abstractmethod
    def _perform(self, driver):
        pass

    @abstractmethod
    def _toSeleniumScript(self):
        pass

    def perform(self, driver):
        try:
            is_flight_task = None
            try:
                wrap_element = driver.find_element(By.ID, "wrap")
                if (wrap_element.tag_name == "iframe"):
                    driver.switch_to.frame(driver.find_element(By.ID, "wrap"))
                    driver.get_lis_html()
                    is_flight_task = True
            except NoSuchElementException:
                pass
            self._perform(driver)
            if (is_flight_task):
                driver.switch_to.default_content()
        except Exception as e:
            if (is_flight_task):
                driver.switch_to.default_content()
            raise CannotPerformActionError(e, self.xpath)

    def toSeleniumScript(self):
        return self._toSeleniumScript()
    
    def __str__(self):
        return self.description


class ClickAction(Action):
    def __init__(self, xpath, description = "Click"):
        super().__init__(xpath)
        self.description = description

    def _perform(self, driver):
        print(f"Performing click action on {self.xpath}")
        try:
            wait = WebDriverWait(driver, 5)
            element = wait.until(EC.element_to_be_clickable((By.XPATH, self.xpath)))    
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
            sleep(5) # wait to scroll
            print("Selenium Click")
            element.click()
        except Exception as e: 
            element =  driver.find_element(By.XPATH, self.xpath)
            print("JS Click: because", str(e))
            # driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
            # sleep(5) # wait to scroll
            driver.execute_script("arguments[0].click();", element)
        try:
            # element =  driver.find_element(By.XPATH, self.xpath)
            # driver.execute_script("arguments[0].unfocus();", element)

            new_tab = None
            main_window = driver.current_window_handle
            all_windows = driver.window_handles
            for window_handle in all_windows:
                if window_handle != main_window:
                    new_tab = window_handle
                    break
            if new_tab:
                print("newTab", new_tab)
                driver.switch_to.window(new_tab)
        except Exception as e:
            print("error", e)
            pass

    def _toSeleniumScript(self):
        return f"""# handler click action {self.xpath}
try:
    element = wait.until(EC.element_to_be_clickable((By.XPATH, '{self.xpath}')))
    driver.execute_script("arguments[0].scrollIntoView();", element)
    sleep(5)
    element.click()
except Exception as e: 
    element =  driver.find_element(By.XPATH, self.xpath)
    driver.execute_script("arguments[0].click();", element)
try:
    new_tab = None
    main_window = driver.current_window_handle
    all_windows = driver.window_handles
    for window_handle in all_windows:
        if window_handle != main_window:
            new_tab = window_handle
            break
    if new_tab:
        print("newTab", new_tab)
        driver.switch_to.window(new_tab)
except Exception as e:
    pass
        """

class InputAction(Action):
    def __init__(self, xpath, content, description = "Input"):
        super().__init__(xpath, description)
        self.content = content

    def _perform(self, driver):
        wait = WebDriverWait(driver, 5)
        element = wait.until(EC.presence_of_element_located((By.XPATH, self.xpath)))
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'}); arguments[0].value = '';", element)
        sleep(5) # wait to scroll
        
        element.clear()
        element.send_keys(self.content)
        # element.send_keys(Keys.TAB) # hot fix, need improve in future
    
    def _toSeleniumScript(self):
        return f"""element = wait.until(EC.presence_of_element_located((By.XPATH, '{self.xpath}')))
driver.execute_script("arguments[0].scrollIntoView(); arguments[0].value = '';", element)
sleep(5) # wait to scroll
element.clear()
element.send_keys('{self.content}')"""
    
class WaitAction(Action):
    def __init__(self, seconds, description = "Wait"):
        super().__init__(None, description)
        self.seconds = seconds

    def _perform(self, driver):
        sleep(self.seconds)

    def _toSeleniumScript(self):
        return f"driver.implicitly_wait({self.seconds})"
    
class EnterAction(Action):
    def __init__(self, xpath, description = "Enter"):
        super().__init__(None, description)
        self.xpath = xpath

    def _perform(self, driver):
        wait = WebDriverWait(driver, 5)
        element = wait.until(EC.presence_of_element_located((By.XPATH, self.xpath)))
        element.send_keys(Keys.RETURN)

    def _toSeleniumScript(self):
        return f"element.send_keys(Keys.RETURN)"
    
class ChainAction(Action):
    def __init__(self, actions, description = "Form submit"):
        super().__init__("chain_action_xpath", description)
        self.actions = actions

    def _perform(self, driver):
        for action in self.actions:
            action.perform(driver)
    
    def _toSeleniumScript(self):
        script = ""
        for action in self.actions:
            script += action.toSeleniumScript() + "\n"
        return script