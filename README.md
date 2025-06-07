# FD Recruitment Task - Todo Application

A Clean Architecture Todo application built with .NET 6 and Angular for technical interview assessment.

## 🏗️ Architecture

This project follows **Clean Architecture** principles with the following layers:

- **Domain**: Core entities and business rules
- **Application**: Business logic and use cases  
- **Infrastructure**: Data access and external services
- **WebUI**: API controllers and Angular frontend

## 🛠️ Technology Stack

### Backend
- **.NET 6** - Web API
- **Entity Framework Core 6** - ORM
- **SQL Server Express** - Database
- **Duende IdentityServer** - Authentication
- **MediatR** - CQRS pattern implementation
- **AutoMapper** - Object mapping
- **FluentValidation** - Input validation

### Frontend
- **Angular** - SPA framework
- **TypeScript** - Programming language
- **Bootstrap** - UI framework
- **RxJS** - Reactive programming

## 🚀 Getting Started

### Prerequisites
- .NET 6 SDK
- Node.js (v14 or higher)
- SQL Server Express
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nhickad/fd-recruitment-task.git
   cd fd-recruitment-task
   ```

2. **Install SQL Server Express**
   - Download and install SQL Server Express 2022
   - Ensure the SQLEXPRESS instance is running

3. **Update connection string** (if needed)
   ```json
   // src/WebUI/appsettings.Development.json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=TodoAppDb;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true"
     }
   }
   ```

4. **Run the application**
   ```bash
   cd src/WebUI
   dotnet run
   ```

5. **Access the application**
   - Frontend: https://localhost:44447
   - Backend API: https://localhost:5001
   - Swagger Documentation: https://localhost:5001/swagger

## 📋 Features

### ✅ Base Features (Implemented)
- User authentication and authorization
- Create, read, update, delete Todo lists
- Create, read, update, delete Todo items
- Clean Architecture implementation
- Entity Framework migrations
- Swagger API documentation

### 🚧 Features to Implement

#### Feature 1: Background Color Customization
- [ ] Users can change background color for each Todo item
- [ ] Color picker interface
- [ ] Persistent color storage

#### Feature 2: Tagging System  
- [ ] Add and remove tags to Todo items
- [ ] Filter Todo items by tags
- [ ] UI shortcuts for most used tags
- [ ] Text search functionality

#### Feature 3: Soft Delete
- [ ] Soft delete for Todo lists and items
- [ ] Items remain in database but hidden from UI
- [ ] Exclude soft-deleted items from queries

## 🌿 Branching Strategy

- **main**: Production-ready code
- **feature/background-color-customization**: Background color feature
- **feature/tagging-system**: Tagging and search feature  
- **feature/soft-delete**: Soft delete implementation

## 🔧 Development

### Running Tests
```bash
# Run all tests
dotnet test

# Run specific project tests
dotnet test tests/Application.UnitTests/
```

### Database Migrations
```bash
# Add new migration
dotnet ef migrations add MigrationName -p src/Infrastructure -s src/WebUI

# Update database
dotnet ef database update -p src/Infrastructure -s src/WebUI
```

### Code Standards
- Follow Clean Architecture principles
- Use CQRS pattern for commands and queries
- Implement proper error handling
- Write unit tests for business logic
- Follow C# and Angular coding conventions

## 📁 Project Structure

```
src/
├── Application/           # Business logic layer
│   ├── Common/           # Shared application logic
│   ├── TodoLists/        # Todo list commands/queries
│   └── TodoItems/        # Todo item commands/queries
├── Domain/               # Core entities and interfaces  
│   ├── Entities/         # Domain entities
│   └── Events/           # Domain events
├── Infrastructure/       # Data access and external services
│   ├── Data/             # Entity Framework context
│   └── Services/         # External service implementations
└── WebUI/               # API controllers and Angular frontend
    ├── Controllers/      # Web API controllers
    └── ClientApp/        # Angular application
```

## 🤝 Contributing

1. Create a feature branch from `main`
2. Implement the feature with tests
3. Create a Pull Request for review
4. Ensure all checks pass before merging

## 📝 License

This project is for educational and interview purposes.

## 👤 Author

**nhickad**
- GitHub: [@nhickad](https://github.com/nhickad)

---

*This project demonstrates Clean Architecture implementation, full-stack development skills, and modern .NET development practices.*