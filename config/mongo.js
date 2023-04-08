const express = require('express')
const router = express.Router();
const env = require('dotenv').config();
const config=require('./config')
const uri = "mongodb+srv://"+process.env.MONGOUSER+":"+encodeURIComponent(process.env.MONGOPASS)+"@cluster0.tpmae.mongodb.net/"+config.DB_NAME+"?retryWrites=true&w=majority";
const { MongoClient} = require('mongodb');
const client = new MongoClient(uri);
const dbRegCollection = "registry";
const dbBlogCollection = "ePosts";
module.exports =client;

