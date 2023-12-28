import { remultExpress } from "remult/remult-express"
import { Customer, Order } from "../shared/entities"
import { repo } from "remult"

export const api = remultExpress({
  entities: [Customer, Order],
  initApi: async () => {
    if ((await repo(Customer).count()) == 0) {
      await repo(Customer).insert([
        { name: "John Doe", city: "New York" },
        { name: "Jane Smith", city: "Los Angeles" },
        { name: "Michael Johnson", city: "Chicago" },
        { name: "Emily White", city: "Houston" },
        { name: "David Brown", city: "Phoenix" },
        { name: "Sarah Miller", city: "Philadelphia" },
        { name: "James Wilson", city: "San Antonio" },
        { name: "Jessica Garcia", city: "San Diego" },
        { name: "Christopher Martinez", city: "Dallas" },
        { name: "Amanda Rodriguez", city: "San Jose" },
        { name: "Elizabeth Martinez", city: "Austin" },
        { name: "Daniel Hernandez", city: "Jacksonville" },
        { name: "Megan Moore", city: "Fort Worth" },
        { name: "Andrew Taylor", city: "Columbus" },
        { name: "Laura Anderson", city: "Charlotte" },
        { name: "Kevin Thomas", city: "Indianapolis" },
        { name: "Brian Jackson", city: "San Francisco" },
        { name: "Susan White", city: "Seattle" },
        { name: "Stephanie Harris", city: "Denver" },
        { name: "Patrick Clark", city: "Washington" },
        { name: "Natalie Davis", city: "Boston" },
        { name: "Samuel Lopez", city: "El Paso" },
        { name: "Ashley Hall", city: "Detroit" },
        { name: "Joseph Lee", city: "Nashville" },
        { name: "Donna Young", city: "Memphis" },
        { name: "Benjamin Allen", city: "Portland" },
        { name: "Karen King", city: "Oklahoma City" },
        { name: "Mark Scott", city: "Las Vegas" },
        { name: "Brenda Wright", city: "Louisville" },
        { name: "Steven Walker", city: "Baltimore" },
        { name: "Michelle Robinson", city: "Milwaukee" },
        { name: "Kenneth Lewis", city: "Albuquerque" },
      ])
    }
  },
})
