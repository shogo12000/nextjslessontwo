"use client";
import {
  getAllUsers,
  getPhotos,
  getProjectAddress,
} from "@/ui/super/actions/actions";
import { useEffect, useState } from "react";
import { ProjectAddress, UserDB, ProjectPhotos } from "@/myTypeScript";

export default function Page() {
  const [employee, setEmployee] = useState<UserDB[]>([]);
  const [address, setAddress] = useState<ProjectAddress[]>([]);
  const [photos, setPhotos] = useState<ProjectPhotos[]>([]);

  // Pegar todos os usuários
  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await getAllUsers();
      setEmployee([...allUsers]);
    };
    getUsers();
  }, []);

  const getAddress = async (id: string) => {
    const workAddress = await getProjectAddress(id);
    console.log(workAddress);
    setAddress([...workAddress]);
    setPhotos([]);
  };

  const getAllPhotos = async (address: string) => {
    const savedPhotos = await getPhotos(address);
    setPhotos([...savedPhotos]);
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-xl font-bold mb-4">Employee Photo History</h1>
      <label htmlFor="employee" className="block mb-2 font-medium">
        Employee name:
      </label>
      <select
        name="userId"
        id="employee"
        className="border p-2 rounded w-full max-w-sm mb-4"
        onChange={(e) => getAddress(e.target.value)}
      >
        <option value="">Select a user</option>
        {employee.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      {address.length > 0 && (
        <>
          <label htmlFor="employee" className="block mb-2 font-medium">
            Project Name:
          </label>
          <select
            name="userId"
            id="employee"
            className="border p-2 rounded w-full max-w-sm mb-4"
            onChange={(e) => getAllPhotos(e.target.value)}
          >
            <option value="">Select Project</option>
            {address.map((address, index) => (
              <option key={index} value={address.workaddress}>
                {address.workaddress}
              </option>
            ))}
          </select>
        </>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {photos.map((photo, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={photo.url}
                alt={photo.workaddress}
                className="w-full h-auto rounded"
              />
              <p className="mt-2 text-sm">{photo.workaddress}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
