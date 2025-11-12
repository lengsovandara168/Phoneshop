"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

type Product = {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  rating?: number;
  description?: string;
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <motion.article
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all"
    >
      <div className="relative w-full h-85 bg-gray-100">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 1040px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 line-clamp-2">
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.description ?? ""}
        </p>

        <div className="mt-3 flex justify-between items-center">
          <span className="text-yellow-500 text-sm font-medium">
            ⭐ {product.rating ?? "—"}
          </span>
          <span className="text-indigo-600 font-bold">${product.price}</span>
        </div>

        <button className="mt-4 w-full py-2 bg-cyan-400 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition">
          Add to Cart
        </button>
      </div>
    </motion.article>
  );
}
