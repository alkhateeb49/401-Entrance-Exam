//
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const dotenv = require('dotenv');
const superAgent = require('superagent');
const override = require('method-override');
const { query } = require('express');
//
dotenv.config();
PORT=process.env.PORT;
const app=express();
app.use(cors());
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));
app.use(override('_method'));
app.set('view engine','ejs');
const client = new pg.Client({connectionString: process.env.DATABASE_URL,ssl: {rejectUnauthorized: false}});
// const client = new pg.Client(process.env.DATABASE_URL);
//
app.get('/',home);
app.get('/getCountryResult',CountryResult);
app.get('/all',allc);
app.get('/addtodb',addtodb);
app.get('/myrec',myrec);
app.get('/viewd',viewd);
app.get('/delete',deleterec);




//
function home(req,res){
    let url='https://api.covid19api.com/world/total';
    superAgent.get(url).then(data=>{
        res.render('pages/index',{data:data.body});

    });
}
function CountryResult(req,res){
    // let rec=[];
    let query={
        from:req.query.from,
        to:req.query.to
    }
    let url='https://api.covid19api.com/country/'+req.query.name+'/status/confirmed';
    superAgent.get(url).query(query).then(data=>{
        // rec.push(new countryRecord(data));
        res.render('pages/CountryResult',{data:data.body});
    });

}

function allc(req,res){
    let url='https://api.covid19api.com/summary';
    superAgent.get(url).then(data=>{
        res.render('pages/all',{data:data.body.Countries});
    });
}

function addtodb(req,res){
    let constr=new countryRecord(req.query.name,req.query.date,req.query.casesc,req.query.casesd,req.query.casesr);
    let sql ='INSERT INTO rec (name,date,casesc,casesd,casesr) VALUES($1,$2,$3,$4,$5);'
    let val=[req.query.name,req.query.date,req.query.casesc,req.query.casesd,req.query.casesr];
    client.query(sql,val);
    res.redirect('/myrec')
}
function myrec(req,res){
    let sql ='SELECT * FROM rec'
    client.query(sql).then(data=>{
        res.render('pages/myrec',{data:data.rows});
    });
}
function viewd(req,res){
    let sql =`SELECT * FROM rec WHERE id = ${req.query.id};`
    client.query(sql).then(data=>{
        res.render('pages/details',{data:data.rows});
    });
}
function deleterec(req,res){
    let sql =`DELETE FROM rec WHERE id = ${req.query.id};`
    client.query(sql).then(data=>{
        res.redirect('/myrec')
    });
}






//
function countryRecord(name,date,casesc,casesd,casesr){
this.name=name;
this.date=date;
this.casesc=casesc;
this.casesd=casesd;
this.casesr=casesr;
}

//
client.connect().then(()=>{
    app.listen(PORT,()=>{
        console.log("App rung on : "+PORT);
    });
}).catch(error=>{console.log(error);});