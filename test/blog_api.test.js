const {test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async ()=>{
    await Blog.deleteMany({})

    for(let blog of helper.initialBlogs){
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('all notes are returned', async () =>{
    const response = await api
                            .get('/api/blogs')
                            .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(response.body.length, helper.initialBlogs.length)    
})

test('identifier property is not _id', async ()=>{
    const response = await api.get('/api/blogs')

    const hasId = response.body.map(r => Object.hasOwn(r,'id'))
                                .every(h => h===true)

    assert.strictEqual(hasId,true)
})

test('a valid blog can be added', async ()=> {
    const newBlog = {
        title: "Playing with arrays",
        author: "Elvis Ojeda",
        url: "https://arraysjs.com/",
        likes: 9
    }

    await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b=>b.title)
    assert(titles.includes('Playing with arrays'))
})

test('blog without likes property is added with value equal to zero ', async ()=>{
    const newBlog = {
        title: "Playing with arrays",
        author: "Elvis Ojeda",
        url: "https://arraysjs.com/",        
    }

    await api
            .post('/api/blogs')
            .send(newBlog)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length +1)

    const lastArray = blogsAtEnd.pop()
    // console.log(blogsAtEnd[blogsAtEnd.length]);
    assert.strictEqual(lastArray.likes, 0)
})

test('blog without title or url get 400 code and it is not added', async ()=>{
    const newBlog = {
        author: "Elvis Ojeda",
        likes: 2
    }

    await api.post('/api/blogs')
            .send(newBlog)
            .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

})

after(async () => {
    await mongoose.connection.close()
})