// #########################################
// ############### CONFIG #################
// #########################################
const config_db = {
  host:     "localhost" ?? process.env.HOST,
  username: "root" ?? process.env.USERDB,
  password: "" ?? process.env.PASSDB,
  database:  "rispark" ?? process.env.DATABASE,
  dialect:  "mysql" ?? process.env.DIALECT
}

//■► EXPORTS:  ◄■: 
module.exports = config_db