const { faker } = require('@faker-js/faker')

const json = [
  {
    name: 'San Francisco',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'New York',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'Chicago',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'Bogotá',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'Bucaramanga',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'Oakland',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'San Leandro',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'Medellín',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'Cali',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: 'Barranquilla',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

module.exports = json
