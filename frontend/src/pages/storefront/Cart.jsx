import { Link } from 'react-router-dom';
import { useCart } from '../../components/storefront/CartContext';
import { Trash2, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

const P = { fontFamily: "'Russo One', sans-serif" };

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartSubtotal, cartItemCount } = useCart();

  if (cartItemCount === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-24 retro-card-light mt-8 text-center">
        <ShoppingCart className="w-16 h-16 text-[#4a4a6a] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#E52521] mb-4" style={P}>Your Cart is empty!</h2>
        <p className="text-[15px] text-[#4a4a6a] mb-8 max-w-lg mx-auto" style={P}>Give it purpose — fill it with electronics, fashion, or anything else!</p>
        <Link to="/shop/catalog" className="retro-btn bg-[#FBD000] hover:bg-[#ffe033] text-black font-bold py-2 px-6 text-[16px]" style={P}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      {/* Cart Items */}
      <div className="flex-1 retro-card-light p-6">
        <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-4">
          <h1 className="text-lg font-bold text-[#E52521] tracking-tight" style={P}>Shopping Cart</h1>
          <span className="text-[17px] text-[#4a4a6a]" style={P}>Price</span>
        </div>

        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item.product.productId} className="flex flex-col sm:flex-row gap-4 border-b-2 border-black/20 pb-6">
              <div className="w-full sm:w-32 h-32 bg-[#1A1A2E] flex-shrink-0 border-2 border-black flex items-center justify-center overflow-hidden relative">
                {item.product.imageUrl ? (
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingCart className="w-8 h-8 text-[#4a4a6a]" />
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between mb-1">
                  <Link to={`/shop/product/${item.product.productId}`} className="text-[15px] font-bold text-[#1A1A2E] hover:text-[#E52521] line-clamp-2" style={P}>
                    {item.product.name}
                  </Link>
                  <span className="text-sm font-bold text-[#E52521] ml-4" style={P}>{formatCurrency(item.product.price)}</span>
                </div>

                <span className="pixel-badge mt-1" style={{ background: '#43B047', color: '#fff' }}>IN STOCK</span>
                <p className="text-[16px] text-[#4a4a6a] mt-2 mb-4" style={P}>FREE Shipping & Return</p>

                <div className="mt-auto flex items-center gap-4">
                  <div className="flex items-center">
                    <button onClick={() => updateQuantity(item.product.productId, item.quantity - 1)}
                      className="bg-[#1A1A2E] text-[#5C94FC] w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-[#049CD8] hover:text-white transition-colors shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
                      -
                    </button>
                    <div className="bg-[#FFF8E7] border-t-2 border-b-2 border-black h-8 px-4 flex items-center justify-center text-[16px] font-bold text-[#1A1A2E]" style={P}>
                      {item.quantity}
                    </div>
                    <button onClick={() => updateQuantity(item.product.productId, item.quantity + 1)}
                      className="bg-[#1A1A2E] text-[#5C94FC] w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-[#049CD8] hover:text-white transition-colors shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
                      +
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.product.productId)}
                    className="retro-btn text-[17px] px-3 py-1 bg-[#E52521] text-white flex items-center gap-1">
                    <Trash2 size={12}/> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4">
          <button onClick={clearCart} className="retro-btn text-[17px] px-4 py-2 bg-[#E52521] text-white flex items-center gap-1">
            <Trash2 size={14}/> Clear Cart
          </button>
          <div className="text-right">
            <span className="text-[15px] text-[#1A1A2E]" style={P}>Subtotal ({cartItemCount} item{cartItemCount !== 1 && 's'}): </span>
            <span className="text-xl font-bold text-[#E52521]" style={P}>{formatCurrency(cartSubtotal)}</span>
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="w-full lg:w-80">
        <div className="retro-card-light p-6 sticky top-6">
          <div className="mb-4">
            <span className="pixel-badge" style={{ background: '#43B047', color: '#fff' }}>FREE SHIPPING</span>
          </div>
          <div className="text-sm mb-6" style={P}>
            Subtotal ({cartItemCount}): <span className="font-bold text-[#E52521]">{formatCurrency(cartSubtotal)}</span>
          </div>
          <Link to="/shop/checkout" className="retro-btn w-full bg-[#FBD000] hover:bg-[#ffe033] text-black font-bold py-3 px-4 text-[16px] text-center block">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
