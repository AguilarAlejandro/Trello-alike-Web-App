const indexCtrl = {}; 

indexCtrl.renderIndex = (req,res) => {
        const pageTitle = 'Home'
        res.render('index', {pageTitle})
    }
    indexCtrl.renderAbout = (req,res) => {
        const pageTitle = 'About'
        res.render('about', {pageTitle})
    }


module.exports = indexCtrl;