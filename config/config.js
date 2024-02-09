// #########################################
// ############### CONFIG #################
// #########################################
const config_db = {
  host: "localhost" ?? process.env.HOST,
  username: "root" ?? process.env.USERDB,
  password: "" ?? process.env.PASSDB,
  database: "rispark" ?? process.env.DATABASE,
  dialect: "mysql" ?? process.env.DIALECT,
  secret: process.env.SECRETKEYJWT ?? '',
  urlFiles: `http://${process.env.HOST}:${process.env.PORT}/api/archivos/`,
  email: {
    smtp: {
      service: 'gmail',
      host: 'smtp.gmail.com' ?? process.env.MAIL_HOST,
      port: 587 ?? process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: 'juan.martinez@cpcoriente.org' ?? process.env.MAIL_USERNAME,
        pass: 'bjif ptby kwao djml' ?? process.env.MAIL_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  },
  url: {
    urlFront: process.env.APP_URL
  }
}

//■► EXPORTS:  ◄■:
module.exports = config_db