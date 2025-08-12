from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:8000/")

    # Take screenshot of dark mode
    page.screenshot(path="jules-scratch/verification/dark_mode.png")

    # Click the theme toggle button
    theme_toggle_button = page.locator('.themeToggleButton')
    theme_toggle_button.click()

    # Take screenshot of light mode
    page.screenshot(path="jules-scratch/verification/light_mode.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
