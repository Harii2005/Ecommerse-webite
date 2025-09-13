# E-commerce Website

A full-stack e-commerce web application built with React.js frontend and Node.js/Express backend with MongoDB database.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Product Management**: Browse, search, and view product details
- **Shopping Cart**: Add/remove items, manage quantities
- **User Profiles**: Manage personal information and order history
- **Admin Panel**: Product management and user administration
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and development server
- **CSS3** - Custom styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
EcommerceWebsite/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Authentication middleware
│   │   ├── models/          # Database models
│   │   └── routes/          # API routes
│   ├── server.js           # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API service functions
│   │   └── utils/          # Utility functions
│   ├── public/
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harii2005/Ecommerse-webite.git
   cd EcommerseWebsite
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

Create a `.env` file in the Backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Seed the Database (Optional)**
   ```bash
   cd Backend
   npm run seed
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/items` - Get all products
- `GET /api/items/:id` - Get product by ID
- `POST /api/items` - Create new product (Admin)
- `PUT /api/items/:id` - Update product (Admin)
- `DELETE /api/items/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart

## 🎨 Pages

- **Home** - Landing page with featured products
- **Products** - Product catalog with filtering
- **Search** - Product search functionality
- **Cart** - Shopping cart management
- **Auth** - Login and registration
- **Profile** - User profile management
- **Admin** - Administrative panel

## 🧪 Testing

Run tests for the backend:
```bash
cd Backend
npm test
```

Run linting for the frontend:
```bash
cd frontend
npm run lint
```

## 📝 Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

- **Hari** - [Harii2005](https://github.com/Harii2005)

## 🙏 Acknowledgments

- React team for the amazing frontend library
- Express.js community for the robust backend framework
- MongoDB for the flexible database solution