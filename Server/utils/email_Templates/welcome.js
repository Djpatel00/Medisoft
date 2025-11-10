export const WelcomeEmailTemplate = (name, memberId, password ) => {
  return [`
  <div
    style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff;
    background-repeat: no-repeat; background-size: 800px 452px; background-position: top center;
    font-size: 14px; color: #434343;">
    <main>
      <div style="margin-top: 10px; padding: 30px; background: #ffffff; border-radius: 30px;">
        <div style="width: 100%; max-width: 489px; margin: 0 auto;">
          <p style="margin-top: 17px; font-size: 16px; font-weight: 500;">
            Hello ${name},
          </p>
          <p style="margin-top: 17px; font-weight: 500; letter-spacing: 0.56px;">
            Welcome to Medisoft. Your Patient ID and Password are given here. Use these details to login to your panel. 
            Do not share Password with others, including Medisoft employees.
          </p>
          <p style="font-size: 15px; font-weight: 600; color: #ba3d4f;">
            Member ID: ${memberId}
          </p>
          <p>Password: ${password}</p>
        </div>
      </div>

      <p style="max-width: 400px; margin: 10px auto 0; text-align: center; font-weight: 500; color: #8c8c8c;">
        Need help? Ask at 
        <a href="mailto:medisoft@gmail.com" style="color: #499fb6; text-decoration: none;">medisoft@gmail.com</a>
        or visit our 
        <a href="" target="_blank" style="color: #499fb6; text-decoration: none;">Help Center</a>
      </p>
    </main>

    <footer style="width: 100%; max-width: 490px; margin: 20px auto 0; text-align: center; border-top: 1px solid #e6ebf1;">
      <p style="margin-top: 10px; font-size: 16px; font-weight: 600; color: #434343;">Medisoft</p>
      <p style="margin-top: 8px; color: #434343;">Address 540, City, State.</p>
      <p style="margin-top: 16px; color: #434343;">Copyright © 2025 Company. All rights reserved.</p>
    </footer>
  </div>
  `, `
  Hello ${name},
  
  Welcome to Medisoft. Your Patient ID and Password are given here. Use these details to login to your panel.
  Do not share Password with others, including Medisoft employees.
  
  Member ID: ${memberId}
  Password: ${password}
  
  Need help? Ask at medisoft@gmail.com or visit our Help Center
  
  Medisoft
  Address 540, City, State.
  Copyright © 2025 Company. All rights reserved.`
  ]
};
