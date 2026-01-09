import React, { useState, useRef } from 'react';
import { ShoppingBag, Eye, Heart, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/useCart';
import { useToast } from '../../contexts/ToastContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { id, title, price, image, brand, category, originalPrice } = product;
    const [isHovered, setIsHovered] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(() => {
        const wishlist = JSON.parse(localStorage.getItem('vss_wishlist') || '[]');
        return wishlist.includes(id);
    });
    const cardRef = useRef(null);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const wishlist = JSON.parse(localStorage.getItem('vss_wishlist') || '[]');

        if (isWishlisted) {
            const updated = wishlist.filter(itemId => itemId !== id);
            localStorage.setItem('vss_wishlist', JSON.stringify(updated));
            setIsWishlisted(false);
            showToast('Removed from wishlist', 'info');
        } else {
            wishlist.push(id);
            localStorage.setItem('vss_wishlist', JSON.stringify(wishlist));
            setIsWishlisted(true);
            showToast('Added to wishlist', 'success');
        }
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/products/${id}`);
    };

    const isOnSale = originalPrice && originalPrice !== price;

    return (
        <Link to={`/products/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
                ref={cardRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    background: 'linear-gradient(145deg, #0C0C0C 0%, #080808 100%)',
                    border: `1px solid ${isHovered ? 'rgba(201, 169, 98, 0.25)' : 'rgba(201, 169, 98, 0.08)'}`,
                    borderRadius: '8px',
                    position: 'relative',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isHovered
                        ? '0 16px 48px rgba(0, 0, 0, 0.6), 0 0 40px rgba(201, 169, 98, 0.08)'
                        : '0 4px 24px rgba(0, 0, 0, 0.4)'
                }}
            >
                {/* Featured Badge */}
                {isOnSale && (
                    <div style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        zIndex: 10,
                        background: 'linear-gradient(135deg, #C9A962 0%, #8B7355 100%)',
                        color: '#050505',
                        padding: '6px 14px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '700',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                    }}>
                        FEATURED
                    </div>
                )}

                {/* Image Container */}
                <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: '260px',
                    background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
                    borderBottom: '1px solid rgba(201, 169, 98, 0.06)'
                }}>
                    {/* Brand Badge */}
                    <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        zIndex: 5,
                        background: 'rgba(5, 5, 5, 0.9)',
                        backdropFilter: 'blur(12px)',
                        padding: '8px 14px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        color: '#C9A962',
                        border: '1px solid rgba(201, 169, 98, 0.2)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase'
                    }}>
                        {brand || 'VS SPEED'}
                    </div>

                    {/* Quick Action Buttons */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: isOnSale ? '90px' : '16px',
                            zIndex: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            opacity: isHovered ? 1 : 0,
                            transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <button
                            onClick={handleWishlist}
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '6px',
                                background: isWishlisted ? 'rgba(201, 169, 98, 0.9)' : 'rgba(5, 5, 5, 0.9)',
                                border: `1px solid ${isWishlisted ? 'rgba(201, 169, 98, 0.5)' : 'rgba(201, 169, 98, 0.2)'}`,
                                color: isWishlisted ? '#050505' : '#C9A962',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(12px)'
                            }}
                        >
                            <Heart size={16} fill={isWishlisted ? '#050505' : 'none'} />
                        </button>
                        <button
                            onClick={handleQuickView}
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '6px',
                                background: 'rgba(5, 5, 5, 0.9)',
                                border: '1px solid rgba(201, 169, 98, 0.2)',
                                color: '#C9A962',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(12px)'
                            }}
                        >
                            <Eye size={16} />
                        </button>
                    </div>

                    {/* Product Image */}
                    <img
                        src={image}
                        alt={title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            padding: '24px',
                            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/400x400/0a0a0a/C9A962?text=' + encodeURIComponent(title.split(' ').slice(0, 2).join('+'));
                        }}
                    />

                    {/* Availability Indicator */}
                    <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(5, 5, 5, 0.9)',
                        backdropFilter: 'blur(12px)',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        letterSpacing: '0.08em',
                        border: '1px solid rgba(201, 169, 98, 0.1)'
                    }}>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            background: '#C9A962',
                            borderRadius: '50%',
                            boxShadow: '0 0 8px rgba(201, 169, 98, 0.6)'
                        }} />
                        <span style={{ color: '#C9A962', textTransform: 'uppercase' }}>Available</span>
                    </div>
                </div>

                {/* Content */}
                <div style={{
                    padding: '20px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <span style={{
                        fontSize: '10px',
                        color: '#707070',
                        fontWeight: '500',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em'
                    }}>
                        {category}
                    </span>
                    <h3 style={{
                        fontSize: '0.95rem',
                        marginBottom: '16px',
                        flex: 1,
                        lineHeight: '1.5',
                        fontWeight: '500',
                        color: '#FAFAFA',
                        letterSpacing: '0.02em'
                    }}>
                        {title}
                    </h3>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'auto',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(201, 169, 98, 0.08)'
                    }}>
                        <div>
                            <span style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: '#C9A962',
                                letterSpacing: '0.02em'
                            }}>
                                {price}
                            </span>
                            {isOnSale && originalPrice && (
                                <span style={{
                                    fontSize: '0.85rem',
                                    color: '#505050',
                                    textDecoration: 'line-through',
                                    marginLeft: '10px'
                                }}>
                                    {originalPrice}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            style={{
                                background: isAdded
                                    ? 'linear-gradient(135deg, #C9A962 0%, #8B7355 100%)'
                                    : 'transparent',
                                color: isAdded ? '#050505' : '#C9A962',
                                border: `1px solid ${isAdded ? 'transparent' : 'rgba(201, 169, 98, 0.4)'}`,
                                padding: '12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                transform: isAdded ? 'scale(1.05)' : 'scale(1)'
                            }}
                        >
                            {isAdded ? <CheckCircle size={18} /> : <ShoppingBag size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
