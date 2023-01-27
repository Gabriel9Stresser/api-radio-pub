const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

//validação do token
const token = "123456";
function authenticate(req, res, next) {
  const authHeader = req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const authToken = authHeader.slice(7);
    if (authToken === token) {
      next();
    } else {
      res.status(401).json({ error: "Acesso negado" });
    }
  } else {
    res.status(401).json({ error: "Acesso negado" });
  }
}

app.post("/radio", authenticate, (req, res) => {
  const radio = req.body.radio;
  console.log(radio);
  require("chromedriver");
  const chrome = require("selenium-webdriver/chrome");
  const webdriver = require("selenium-webdriver");

  let options = new chrome.Options();
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-setuid-sandbox");
  options.addArguments("--disable-gpu");
  options.addArguments("--window-size=1920,1080");
  options.addArguments("--headless");

  (async function example() {
    const { Builder, By, Key, until } = require("selenium-webdriver");

    const driver = new webdriver.Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    try {
      console.log("Iniciando...");
      await driver.get("https://cloud.audioserv.com.br/Login.asp");
      console.log("Navegando para a URL...");

      // Preenchendo os campos de login e clicando no botão de login
      await driver
        .findElement(By.id("email"))
        .sendKeys("colar email aqui");
      await driver.findElement(By.id("key")).sendKeys("colar senha aqui", Key.RETURN);

      // Esperando até que o link seja carregado
      await driver.wait(
        until.elementLocated(By.css("a[href*='CriarRadio.asp']"))
      );
      let element = await driver.findElement(
        By.css("a[href*='CriarRadio.asp']")
      );
      await element.click();

      //login radio
      await driver.wait(until.elementLocated(By.css("#LoginRadio")));
      let loginRadio = await driver.findElement(By.css("#LoginRadio"));
      let randomLogin = "c" + Math.random().toString().slice(-18);
      await loginRadio.sendKeys(randomLogin);

      //nome da radio
      await driver.wait(until.elementLocated(By.css("#NomeRadio")));
      let raadio = await driver.findElement(By.css("#NomeRadio"));
      await raadio.sendKeys(radio);

      //senhan
      await driver.wait(until.elementLocated(By.css("#SenhaRadio")));
      let senhaRadio = await driver.findElement(By.css("#SenhaRadio"));
      await senhaRadio.sendKeys("@admin");

      //segmento
      let segmen = await driver.findElement(By.css("[value='9']"));
      await segmen.click();

      //ativar radio experimental
      let experimental = await driver.findElement(
        By.xpath("//input[@id='radioExperimental']/..")
      );
      await driver.sleep(3000);
      await experimental.click();

      let criar = await driver.findElement(
        By.xpath("//button[text()='Criar a rádio agora']")
      );
      await driver.sleep(3000);
      await criar.click();
      await driver.sleep(3000);
      //salvar link radio
      //salvar link radio
      await driver.wait(
        until.elementLocated(By.css("input[name='linkDireto']"))
      );
      let linkDireto = await driver.findElement(
        By.css("input[name='linkDireto']")
      );
      let urlRadio = await linkDireto.getAttribute("value");
      console.log("seu link da radio: " + urlRadio);

      return res.json({ nome: radio, url: urlRadio, senha: "@admin" });
    } finally {
      await driver.quit();
    }
  })();
});

app.listen(3000, () => {
  console.log("API rodando na porta: http://localhost:3000/radio ");
});
