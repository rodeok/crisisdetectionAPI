const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const { response } = require('express')
const PORT = process.env.PORT || 4000
const app = express()
const articles = []

const newspapers = [
    {
        name: 'Guardian',
        address: 'https://guardian.ng/news/buhari-leaves-for-nairobi-london-as-fuel-scarcity-bites-harder-nationwide/',
        base: ''
    },
    {
        name: 'GUARDIAN NG',
        address: 'https://guardian.ng/category/news/world/',
        base: ''
    },
    {
        name: 'nigeria',
        address: 'https://guardian.ng/breakingnews/buhari-orders-release-of-8-5m-to-evacuate-nigerians-caught-up-in-russia-ukraine-war/',
        base: 'https://guardiian.ng'
    },
    {
        name: 'punch',
        address: 'https://punchng.com/',
        base: ''

    }
]

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('a:contains("war")', html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')

            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })
        })
    })
})



app.get('/', (req,res)=>{
    res.json('Welcome to webscrapper')
})


app.get('/news', (req,res)=>{
    res.json(articles)
})

app.get('/news/:newspaperId',(req,res)=>{
      const newspaperId = req.params.newspaperId 
     const newspaperRoom =  newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
     const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
   

      axios.get(newspaperRoom)
      .then(response=>{
          const html = response.data
          const $ = cheerio.load(html)
          const specificArticle = []
          
          $('a:contains("war")', html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
             specificArticle.push({
                 title,
                 url: newspaperBase + url,
                 source: newspaperId
             })
          })
          res.json(specificArticle)
      }).catch(err => console.log(err))


})

app.listen(PORT, ()=>console.log(`Server Connected at ${PORT}`))