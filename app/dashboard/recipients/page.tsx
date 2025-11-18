"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from "@/components/ui/modal";
import { Plus, Edit, Trash2, Users as UsersIcon } from "lucide-react";
import { Recipient } from "@/lib/types";

export default function RecipientsPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    relationship: "",
  });

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      const response = await fetch("/api/recipients");
      const data = await response.json();
      if (data.success) {
        setRecipients(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch recipients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (recipient?: Recipient) => {
    if (recipient) {
      setEditingRecipient(recipient);
      setFormData({
        name: recipient.name,
        email: recipient.email,
        relationship: recipient.relationship || "",
      });
    } else {
      setEditingRecipient(null);
      setFormData({ name: "", email: "", relationship: "" });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingRecipient(null);
    setFormData({ name: "", email: "", relationship: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingRecipient
        ? `/api/recipients/${editingRecipient.id}`
        : "/api/recipients";
      const method = editingRecipient ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        fetchRecipients();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Failed to save recipient:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipient?")) return;

    try {
      const response = await fetch(`/api/recipients/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRecipients(recipients.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete recipient:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Recipients</h1>
          <p className="text-gray-600 mt-1">Manage people who can receive your messages</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-5 h-5" />
          Add Recipient
        </Button>
      </div>

      {recipients.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary-blue/10 flex items-center justify-center mb-6">
              <UsersIcon className="w-10 h-10 text-primary-blue" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No recipients yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Add recipients to send them video messages
            </p>
            <Button onClick={() => handleOpenModal()} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Add your first recipient
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Relationship</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recipients.map((recipient) => (
                    <tr key={recipient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{recipient.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{recipient.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {recipient.relationship || "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenModal(recipient)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(recipient.id)}
                            className="text-rose-heart hover:bg-rose-heart/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <ModalHeader>
          <ModalTitle>
            {editingRecipient ? "Edit Recipient" : "Add Recipient"}
          </ModalTitle>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship (optional)</Label>
              <Input
                id="relationship"
                placeholder="e.g., Daughter, Friend, Partner"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              />
            </div>
          </ModalContent>
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingRecipient ? "Save Changes" : "Add Recipient"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
