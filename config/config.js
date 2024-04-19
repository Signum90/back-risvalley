// #########################################
// ############### CONFIG #################
// #########################################
const config_db = {
  host: process.env.HOST ?? 'localhost',
  username: process.env.USERDB ?? "root",
  password: process.env.PASSDB ?? "",
  database: process.env.DATABASE ?? "rispark",
  dialect: process.env.DIALECT ?? "mysql",
  secret: process.env.SECRETKEYJWT ?? '',
  urlFiles: `https://api.rispark.com.co/api/archivos/`,
  TZ : 'America/Bogota',
  email: {
    smtp: {
      //service: 'gmail',
      //host: 'smtp.gmail.com' ?? process.env.MAIL_HOST,
      host: 'mail.rispark.com.co', // Dirección del servidor SMTP de cPanel
      port: 465,
      secure: true,
      auth: {
        user: 'info@rispark.com.co' ?? process.env.MAIL_USERNAME,
        pass: 'em_::rispark2024' ?? process.env.MAIL_PASSWORD,
      },
    },
    from: 'info@rispark.com.co' ?? process.env.EMAIL_FROM,
  },
  url: {
    urlFront: process.env.APP_URL
  }
}

//■► EXPORTS:  ◄■:
module.exports = config_db