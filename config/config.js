// #########################################
// ############### CONFIG #################
// #########################################
const config_db = {
  host:     "localhost" ?? process.env.HOST,
  username: "root" ?? process.env.USERDB,
  password: "" ?? process.env.PASSDB,
  database:  "rispark" ?? process.env.DATABASE,
  dialect:  "mysql" ?? process.env.DIALECT,
  secret: process.env.SECRETKEYJWT ?? ''
}

//■► EXPORTS:  ◄■: 
module.exports = config_db