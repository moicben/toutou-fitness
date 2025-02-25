const { delay } = require('./utils');

async function verifyPayment(browser, page, otpCode) {

  console.log('3D-secure loaded');
  await page.screenshot({ path: 'eneba_3d.png' });

  if (otpCode) {
    // Click in the middle of the screen
    await page.mouse.click(page.viewport().width / 2, page.viewport().height / 2);
    console.log('Clicked in the middle of the screen');
    await delay(1000);

    // Entering OTP code
    await page.keyboard.press('Tab');
    await delay(1000);
    await page.keyboard.press('Tab');
    await delay(1000);  

    await page.keyboard.type(otpCode);
    await delay(1000);

    await page.screenshot({ path: 'eneba_otp.png' });
    await page.keyboard.press('Tab');
    await delay(1000);

    // Send OTP code
    await page.keyboard.press('Enter');
    console.log('OTP code sent');
    await delay(5000);

  } else {
    // Giving time to user to validate 3D-secure
    await delay(45000);
    console.log('3D-secure time passed');
  }

  await page.screenshot({ path: 'eneba_passed.png' });

  // Wait for payment to be processed
  await delay(15000);
  await page.screenshot({ path: 'eneba_verified.png' });


  // Résolution du captcha CloudFare
  console.log('Attempting to solve captcha...');
  await page.keyboard.press('Tab');
  await delay(1000);  
  await page.keyboard.press('Enter');
  await delay(2000);
  await page.screenshot({ path: 'eneba_captcha1.png' });

  await page.keyboard.press('Tab');
  await delay(1000);
  await page.keyboard.press('Enter');
  await delay(2000);
  await page.screenshot({ path: 'eneba_captcha2.png' });

  await delay(5000);
  await page.screenshot({ path: 'eneba_captcha3.png' });

  await page.keyboard.press('Tab');
  await delay(1000);
  await page.keyboard.press('Enter');
  await delay(2000);
  await page.screenshot({ path: 'eneba_captcha4.png' });
  
  
  // ----------------------------------------------------------

  // Get HTML content
  console.log('Page content:', await page.content());

  await delay(1000);

  await browser.close();
}

module.exports = { verifyPayment };
