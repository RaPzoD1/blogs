const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog.find({})
  response.json(blogs)
    
  })
  
blogsRouter.post('/', async (request, response, next) => {

  const body = request.body

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  if(body.likes === undefined){
      newBlog.likes = 0
  }

  if(body.title === undefined || body.url === undefined){
    return response.status(400).json({
      error: 'title or url missing'
    })
  }
  
  const blog = new Blog(newBlog) 
  const result = await blog.save()
  response.status(201).json(result)
    
      
})

blogsRouter.put('/:id', async (req, res) =>{
  const {title, author, url, likes} = req.body

  const blog = {
    title,
    author,
    url,
    likes
  }

  const updateBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {new:true, runValidators:true, context:'query'})
  res.json(updateBlog)
})

blogsRouter.delete('/:id', async (req, res)=>{

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter