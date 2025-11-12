"use client";

import React, { useState } from "react";
import Image from "next/image";
import Modal from "./ui/Modal";
import FieldLabel from "./ui/FieldLabel";
import Input from "./ui/Input";
import { useAddProductForm } from "./add-product/useAddProductForm";

export default function AddProductForm() {
  const [validationError, setValidationError] = useState<string | null>(null);
  const {
    isOpen,
    open,
    close,
    title,
    price,
    description,
    preview,
    fileName,
    firstInputRef,
    onFileChange,
    handleSubmit,
    setTitle,
    setPrice,
    setDescription,
    loading,
    error,
  } = useAddProductForm();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    const priceNum = Number(price);

    if (!title || !title.trim()) {
      setValidationError("Title is required.");
      return;
    }
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      setValidationError("Price must be a number greater than 0.");
      return;
    }
    if (!description || !description.trim()) {
      setValidationError("Description is required.");
      return;
    }
    if (!fileName) {
      setValidationError("Please select an image.");
      return;
    }

    // call existing submit handler (keeps existing behavior in the hook)
    handleSubmit(e);
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
      >
        + Add Product
      </button>

      <Modal open={isOpen} onCloseAction={close} title="Add product">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">
              Add Product
            </h3>
            <p className="text-sm text-gray-500">
              Add a new product to the demo catalog.
            </p>
          </div>
          <button
            onClick={close}
            className="text-gray-500 hover:text-gray-700 rounded p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <FieldLabel>Title</FieldLabel>
            <Input
              ref={firstInputRef}
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Minimal Phone"
            />
          </div>

          <div>
            <FieldLabel>Price</FieldLabel>
            <Input
              name="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <FieldLabel>Description</FieldLabel>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-300 px-3 py-2"
              placeholder="Short description"
            />
          </div>

          <div>
            <FieldLabel>Image</FieldLabel>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="text-sm"
              />
              <div className="text-sm text-gray-500">
                {fileName ?? "No file selected"}
              </div>
            </div>
            {preview && (
              <div className="mt-3">
                <Image
                  src={preview}
                  alt="preview"
                  width={720}
                  height={360}
                  unoptimized
                  className="w-full h-48 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          {(validationError || error) && (
            <div className="text-red-600 text-sm">
              {validationError ?? error}
            </div>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
