const App = () => {
  const [page, setPage] = useState('home');
  const [context, setContext] = useState(null);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const navigate = (target, data = null) => {
    setPage(target);
    setContext(data);
    window.scrollTo(0, 0);
  };

  const addToCart = (dish) => {
    setCart([...cart, dish]);
  };

  const removeFromCart = (dishId) => {
    setCart(cart.filter(dish => dish.id !== dishId));
  };

  const toggleFavorite = (dishId) => {
    if (favorites.has(dishId)) {
      favorites.delete(dishId);
    } else {
      favorites.add(dishId);
    }
    setFavorites(new Set(favorites));
  };

  const dishData = [
    { id: 1, name: "Margherita Pizza", price: 12.99, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop", description: "Classic pizza with fresh mozzarella and basil.", rating: 4.5 },
    { id: 2, name: "Caesar Salad", price: 8.99, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop", description: "Crisp romaine lettuce, Parmesan cheese, croutons.", rating: 4.2 },
    // Add 10 more dishes with realistic details
  ];

  // Inline components for each page
  const Home = () => (
    <div className="p-6">
      <h1 className="text-4xl font-bold">Welcome to Palms Restaurant</h1>
      <p className="text-base mt-4">Experience exquisite dining with our carefully curated menu.</p>
      <button onClick={() => navigate('menu')} className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Explore Menu</button>
    </div>
  );

  const Menu = () => (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Our Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dishData.map(dish => (
          <div key={dish.id} className="bg-white rounded-xl shadow-md p-4 hover:scale-[1.02] transition-transform duration-200">
            <img src={dish.image} alt={dish.name} className="w-full h-40 object-cover rounded-lg" />
            <h3 className="text-xl font-bold mt-2">{dish.name}</h3>
            <p className="text-sm text-gray-600">{dish.description}</p>
            <p className="text-lg font-semibold text-orange-500">${dish.price.toFixed(2)}</p>
            <button onClick={() => addToCart(dish)} className="mt-2 bg-amber-400 text-gray-900 px-3 py-1 rounded hover:bg-amber-500">Add to Cart</button>
            <button onClick={() => toggleFavorite(dish.id)} className={`ml-2 ${favorites.has(dish.id) ? 'text-red-500' : 'text-gray-400'}`}>❤️</button>
          </div>
        ))}
      </div>
    </div>
  );

  const Cart = () => (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-base text-gray-600">Your cart is empty. Start adding some dishes!</p>
      ) : (
        <div>
          {cart.map(dish => (
            <div key={dish.id} className="flex items-center justify-between mb-4">
              <img src={dish.image} alt={dish.name} className="w-16 h-16 object-cover rounded-lg" />
              <h3 className="text-xl font-bold">{dish.name}</h3>
              <p className="text-lg font-semibold text-orange-500">${dish.price.toFixed(2)}</p>
              <button onClick={() => removeFromCart(dish.id)} className="text-red-500 hover:text-red-600">Remove</button>
            </div>
          ))}
          <button onClick={() => navigate('checkout')} className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Proceed to Checkout</button>
        </div>
      )}
    </div>
  );

  const Checkout = () => (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Checkout</h2>
      <p className="text-base text-gray-600">Complete your purchase and enjoy your meal!</p>
      <button onClick={() => alert('Checkout complete!')} className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Confirm Order</button>
    </div>
  );

  const Reservations = () => (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Reservations</h2>
      <p className="text-base text-gray-600">Book a table in advance to ensure your spot.</p>
      <button onClick={() => alert('Reservation confirmed!')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Book Table</button>
    </div>
  );

  const Contact = () => (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
      <p className="text-base text-gray-600">Feel free to reach out for any queries or feedback.</p>
      <button onClick={() => alert('Message sent!')} className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">Send Message</button>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-stone-50 text-gray-900'}`}>
      <header className="p-4 bg-orange-500 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Palms Restaurant</h1>
        <nav className="flex space-x-4">
          <button onClick={() => navigate('home')} className="hover:underline">Home</button>
          <button onClick={() => navigate('menu')} className="hover:underline">Menu</button>
          <button onClick={() => navigate('cart')} className="hover:underline">Cart</button>
          <button onClick={() => navigate('reservations')} className="hover:underline">Reservations</button>
          <button onClick={() => navigate('contact')} className="hover:underline">Contact</button>
        </nav>
        <button onClick={() => setDarkMode(!darkMode)} className="ml-4">
          {darkMode ? '🌞' : '🌙'}
        </button>
      </header>
      <main>
        {page === 'home' && <Home />}
        {page === 'menu' && <Menu />}
        {page === 'cart' && <Cart />}
        {page === 'checkout' && <Checkout />}
        {page === 'reservations' && <Reservations />}
        {page === 'contact' && <Contact />}
      </main>
    </div>
  );
};