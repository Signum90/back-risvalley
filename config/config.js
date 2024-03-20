// #########################################
// ############### CONFIG #################
// #########################################
// const config_db = {
//   host: process.env.HOST ?? 'localhost',
//   username: process.env.USERDB ?? "cpcoriente_rispark",
//   password: process.env.PASSDB ?? "Rispark_:bd2024",
//   database: process.env.DATABASE ?? "cpcoriente_risparkbd",
//   dialect: process.env.DIALECT ?? "mysql",
//   secret: process.env.SECRETKEYJWT ?? '',
//   urlFiles: `http://${process.env.HOST}:${process.env.PORT}/api/archivos/`,
//   email: {
//     smtp: {
//       service: 'gmail',
//       host: 'smtp.gmail.com' ?? process.env.MAIL_HOST,
//       port: 587 ?? process.env.MAIL_PORT,
//       secure: false,
//       auth: {
//         user: 'juan.martinez@cpcoriente.org' ?? process.env.MAIL_USERNAME,
//         pass: 'bjif ptby kwao djml' ?? process.env.MAIL_PASSWORD,
//       },
//     },
//     from: process.env.EMAIL_FROM,
//   },
//   url: {
//     urlFront: process.env.APP_URL
//   }
// }

const config_db = {
  host: 'localhost',
  username: "cpcoriente_rispark",
  password: "rispark123456",
  database: "cpcoriente_risparkbd",
  dialect: "mysql",
  secret: 'das09df987y3nd0983nfzzqair3fd34',
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