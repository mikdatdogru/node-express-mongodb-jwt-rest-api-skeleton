/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const City = require('../app/models/city')
const { faker } = require('@faker-js/faker')
const request = require('supertest')
const { expect } = require('chai')
const server = require('../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345'
}
let token = ''
const createdID = []
const name = faker.lorem.words()
const newName = faker.lorem.words()
const repeatedName = faker.lorem.words()

describe('*********** CITIES ***********', () => {
  describe('/POST login', () => {
    it('should GET token', async () => {
      const response = await request(server)
        .post('/login')
        .send(loginDetails)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('token')
      token = response.body.token
    })
  })

  describe('/GET cities', () => {
    it('should NOT be able to consume the route since no token was sent', async () => {
      await request(server).get('/cities').expect(401)
    })
    it('should GET all the cities', async () => {
      const response = await request(server)
        .get('/cities')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body.docs).to.be.an('array')
    })
    it('should GET the cities with filters', async () => {
      const response = await request(server)
        .get('/cities?filter=Bucaramanga&fields=name')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body.docs).to.be.an('array')
      expect(response.body.docs).to.have.lengthOf(1)
      expect(response.body.docs[0]).to.have.property('name', 'Bucaramanga')
    })
  })

  describe('/POST city', () => {
    it('should NOT POST a city without name', async () => {
      const city = {}
      const response = await request(server)
        .post('/cities')
        .set('Authorization', `Bearer ${token}`)
        .send(city)
        .expect(422)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('errors')
    })
    it('should POST a city', async () => {
      const city = {
        name
      }
      const response = await request(server)
        .post('/cities')
        .set('Authorization', `Bearer ${token}`)
        .send(city)
        .expect(201)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.include.keys('_id', 'name')
      createdID.push(response.body._id)
    })
    it('should NOT POST a city that already exists', async () => {
      const city = {
        name
      }
      const response = await request(server)
        .post('/cities')
        .set('Authorization', `Bearer ${token}`)
        .send(city)
        .expect(422)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('errors')
    })
  })

  describe('/GET/:id city', () => {
    it('should GET a city by the given id', async () => {
      const id = createdID.slice(-1).pop()
      const response = await request(server)
        .get(`/cities/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('name')
      expect(response.body).to.have.property('_id', id)
    })
  })

  describe('/PATCH/:id city', () => {
    it('should UPDATE a city given the id', async () => {
      const id = createdID.slice(-1).pop()
      const response = await request(server)
        .patch(`/cities/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: newName
        })
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('_id', id)
      expect(response.body).to.have.property('name', newName)
    })
    it('should NOT UPDATE a city that already exists', async () => {
      const city = {
        name: repeatedName
      }
      // First create a city
      const createResponse = await request(server)
        .post('/cities')
        .set('Authorization', `Bearer ${token}`)
        .send(city)
        .expect(201)
        .expect('Content-Type', /json/)

      expect(createResponse.body).to.be.an('object')
      expect(createResponse.body).to.include.keys('_id', 'name')
      expect(createResponse.body).to.have.property('name', repeatedName)
      createdID.push(createResponse.body._id)

      // Then try to update with existing name
      const anotherCity = {
        name: newName
      }
      const updateResponse = await request(server)
        .patch(`/cities/${createdID.slice(-1).pop()}`)
        .set('Authorization', `Bearer ${token}`)
        .send(anotherCity)
        .expect(422)
        .expect('Content-Type', /json/)

      expect(updateResponse.body).to.be.an('object')
      expect(updateResponse.body).to.have.property('errors')
    })
  })

  describe('/DELETE/:id city', () => {
    it('should DELETE a city given the id', async () => {
      const city = {
        name
      }
      // First create a city
      const createResponse = await request(server)
        .post('/cities')
        .set('Authorization', `Bearer ${token}`)
        .send(city)
        .expect(201)
        .expect('Content-Type', /json/)

      expect(createResponse.body).to.be.an('object')
      expect(createResponse.body).to.include.keys('_id', 'name')
      expect(createResponse.body).to.have.property('name', name)

      // Then delete it
      const deleteResponse = await request(server)
        .delete(`/cities/${createResponse.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(deleteResponse.body).to.be.an('object')
      expect(deleteResponse.body).to.have.property('msg', 'DELETED')
    })
  })

  after(async () => {
    for (const id of createdID) {
      try {
        await City.findByIdAndDelete(id)
      } catch (err) {
        console.log(err)
      }
    }
  })
})
