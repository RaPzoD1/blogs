const dummy = (blogs) => {    
        return 1    
}

const totalLikes = (blogs) => {

    return blogs.length === 0
        ?  0
        : blogs.reduce((sum,item) => sum + item.likes, 0 )
}

module.exports = {
    dummy,
    totalLikes
}