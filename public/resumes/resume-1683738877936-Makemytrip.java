package selenium.web;

import java.util.NoSuchElementException;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class Makemytrip {
	public static WebDriver driver = null;
	public static void main(String x[]) throws InterruptedException {
		System.setProperty("webdriver.chrome.driver",".\\driver\\chromedriver.exe");
		ChromeOptions co = new ChromeOptions();
		co.addArguments("--remote-allow-origins=*","ignore-certificate-errors");
		driver = new ChromeDriver(co);
		driver.manage().window().maximize();
		driver.navigate().to("https://www.makemytrip.com/");
		driver.manage().timeouts().implicitlyWait(10,TimeUnit.SECONDS);
		Thread.sleep(3000);
		try {
			WebElement frame1 = driver.findElement(By.id("webklipper-publisher-widget-container-notification-frame"));
			driver.switchTo().frame(frame1);
			driver.findElement(By.id("webklipper-publisher-widget-container-notification-close-div")).click();
			driver.switchTo().defaultContent();
		}
		catch(NoSuchElementException e){
			
		}
		Thread.sleep(2000);
		// check the tickets from hyderabad to ongole for bus journey on your desired date
		driver.findElement(By.xpath("/html/body/div[1]/div/div[1]/div[1]/div[2]/div/div/nav/ul/li[6]/div/a")).click();
		driver.manage().timeouts().implicitlyWait(10,TimeUnit.SECONDS);
		driver.findElement(By.xpath("/html/body/div[1]/div/div[2]/div/div/div[2]/div/div[1]/label")).click();
		Thread.sleep(1000);
		driver.findElement(By.xpath("/html/body/div[1]/div/div[2]/div/div/div[2]/div/div[1]/div[1]/div/div/div/input")).sendKeys("Hyderabad");
		Thread.sleep(1000);
		driver.findElement(By.cssSelector("#react-autowhatever-1-section-0-item-0 > div > p")).click();
		Thread.sleep(1000);
		driver.findElement(By.xpath("/html/body/div[1]/div/div[2]/div/div/div[2]/div/div[2]/div[1]/div/div/div/input")).sendKeys("ongole");
		Thread.sleep(1000);
		driver.findElement(By.cssSelector("#react-autowhatever-1-section-0-item-0 > div > p")).click();
		Thread.sleep(1000);
		driver.findElement(By.xpath("//*[@aria-label='Mon Mar 27 2023']")).click();
		Thread.sleep(1000);
		driver.findElement(By.xpath("/html/body/div[1]/div/div[2]/div/div/div[2]/p/button")).click();
		Thread.sleep(5000);
		driver.navigate().back();
		Thread.sleep(1000);
		driver.findElement(By.className("menu_Trains")).click();
		Thread.sleep(1000);
		driver.findElement(By.id("fromCity")).click();
		Thread.sleep(1000);
		driver.findElement(By.cssSelector(".react-autosuggest__input.react-autosuggest__input--open")).sendKeys("Tadepalligudem");
		Thread.sleep(1000);
		driver.findElement(By.id("react-autowhatever-1-section-0-item-0")).click();
		Thread.sleep(1000);
		driver.findElement(By.cssSelector(".react-autosuggest__input.react-autosuggest__input--open")).sendKeys("Chennai");
		Thread.sleep(1000);
		driver.findElement(By.id("react-autowhatever-1-section-0-item-0")).click();
		Thread.sleep(1000);
		driver.findElement(By.xpath("//*[@aria-label='Mon Mar 27 2023']")).click();
		Thread.sleep(1000);
		driver.findElement(By.cssSelector(".travelForPopup li:nth-child(1)")).click();
		Thread.sleep(1000);
		driver.findElement(By.cssSelector(".primaryBtn.font24.latoBold.widgetSearchBtn")).click();
		Thread.sleep(1000);
		driver.findElement(By.className("menu_Flights")).click();
		Thread.sleep(1000);
		driver.findElement(By.id("fromCity")).click();
		Thread.sleep(1000);
		driver.findElement(By.cssSelector(".react-autosuggest__input.react-autosuggest__input--open")).sendKeys("Banglore");
		Thread.sleep(1000);
		driver.findElement(By.id("react-autowhatever-1-section-0-item-0")).click();
		Thread.sleep(1000);
		driver.findElement(By.id("toCity")).click();
		driver.findElement(By.cssSelector(".react-autosuggest__input.react-autosuggest__input--open")).sendKeys("Delhi");
		Thread.sleep(1000);
		driver.findElement(By.id("react-autowhatever-1-section-0-item-0")).click();
		Thread.sleep(1000);
		driver.findElement(By.xpath("//*[@aria-label='Mon Mar 27 2023']")).click();
		Thread.sleep(1000);
		driver.findElement(By.cssSelector(".primaryBtn.font24.latoBold.widgetSearchBtn")).click();
		Thread.sleep(10000);
		driver.close();
		driver.quit();
	}
}
