"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { readFileAsDataURL, uploadToCloudinary, TINY_PLACEHOLDER } from "@/app/lib/uploads";

export type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  thumbnail: string;
  rating?: number;
};

export type NewProduct = {
  title: string;
  price: number;
  description?: string;
  thumbnail: string;
};

export function useAddProductForm() {
  const qc = useQueryClient();

  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");

  // file + preview
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => firstInputRef.current?.focus(), 10);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  const open = () => {
    setIsOpen(true);
    setError(null);
  };
  const close = () => {
    setIsOpen(false);
    setError(null);
  };

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !price.trim()) {
      setError("Title and price are required");
      return;
    }

    setLoading(true);
    const tempId = Date.now();
    try {
      let thumbnail = TINY_PLACEHOLDER;
      if (file) {
        const hasCloudinary =
          !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
          !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        thumbnail = hasCloudinary
          ? await uploadToCloudinary(file)
          : await readFileAsDataURL(file);
      }

      const newProduct: NewProduct = {
        title: title.trim(),
        price: Number(price),
        description: description.trim(),
        thumbnail,
      };

      const tempProduct: Product = { id: tempId, ...newProduct };
      qc.setQueryData<Product[] | undefined>(["products"], (old) =>
        old ? [tempProduct, ...old] : [tempProduct]
      );

      const res = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProduct.title,
          description: newProduct.description,
          price: newProduct.price,
          ...(newProduct.thumbnail.startsWith("http")
            ? { thumbnail: newProduct.thumbnail }
            : {}),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server ${res.status}: ${text.slice(0, 200)}`);
      }
      const saved = (await res.json()) as Product;

      const mergedSaved: Product = {
        ...saved,
        thumbnail: newProduct.thumbnail || saved.thumbnail || TINY_PLACEHOLDER,
      };
      qc.setQueryData<Product[] | undefined>(["products"], (old) =>
        old ? old.map((p) => (p.id === tempId ? mergedSaved : p)) : [mergedSaved]
      );

      // reset
      setTitle("");
      setPrice("");
      setDescription("");
      setFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      close();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add product";
      setError(message);
      qc.setQueryData<Product[] | undefined>(["products"], (old) =>
        old ? old.filter((p) => p.id !== tempId) : []
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    // state
    isOpen,
    loading,
    error,
    preview,
    title,
    price,
    description,
    fileName: file?.name ?? null,

    // refs
    firstInputRef,
    fileRef,

    // actions
    open,
    close,
    setTitle,
    setPrice,
    setDescription,
    onFileChange,
    handleSubmit,
    setError,
  };
}