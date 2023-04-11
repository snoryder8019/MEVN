const express =require('express')
const env = require('dotenv').config()
const router =express.Router()
const config = require('./config')
const uri = "mongodb+srv://"+process.env.MONGOUSER+":"+encodeURIComponent(process.env.MONGOPASS)+"@cluster0.tpmae.mongodb.net/"+config.DB_NAME+"?retryWrites=true&w=majority";
const {MongoClient} =require('mongodb')
const client = new MongoClient(uri)
module.exports =client