# E-commerce Store Platform

Welcome to the root repository of the E-commerce Store platform. This project encompasses all the services required to run a full-scale modern e-commerce application.

## 🏗️ Project Structure

The repository is organized as a workspace with the following primary modules:

- **/backend**: The core RESTful API server. Built with **Node.js, Express, TypeScript, Sequelize (Postgres), and Redis**. It handles all business logic, data persistence, and administrative APIs. See the [Backend README](./backend/README.md) for detailed information.
- **/frontend**: *(Planned)* The client-facing storefront application for customers to browse and purchase products.
- **/admin**: *(Planned)* The administrative web dashboard for store owners to manage inventory, categories, orders, and users.
- **/ApiCollections**: Contains comprehensive OpenAPI specifications (e.g., `Favric Routes.openapi.json`) detailing the available backend endpoints. These files can be imported into tools like Postman or Insomnia for testing.

## 🚀 Quick Start

Currently, the primary service implemented is the `backend`.

To get the backend server up and running:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm run dev
   ```

> Ensure you have your PostgreSQL and Redis services running locally and have properly configured your `.env` file before starting the backend server.

## 💡 Architecture Goals
- **Modularity**: Maintain strict separation between the backend service, customer frontend, and admin portal.
- **Scalability**: Utilize caching (Redis) and a solid relational data model (Postgres) to handle increasing load.
- **Type Safety**: End-to-end TypeScript enforcement across backend configurations and API request/response lifecycles.
