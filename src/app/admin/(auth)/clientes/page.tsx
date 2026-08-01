export const dynamic = "force-dynamic";

import { getTodosClientes } from "@/lib/actions";
import Link from "next/link";
import { db } from "@/db";
import { reservas } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export default async function ClientesPage() {
  const clientes = await getTodosClientes();

  const clientesConAsistencias = await Promise.all(
    clientes.map(async (cliente) => {
      const [result] = await db
        .select({ total: count() })
        .from(reservas)
        .where(eq(reservas.clienteId, cliente.id));
      return { ...cliente, asistencias: result?.total ?? 0 };
    })
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        href="/admin"
        className="text-sm text-violet-600 hover:text-violet-800 font-medium mb-6 inline-block"
      >
        ← Volver a administración
      </Link>

      <h1 className="text-3xl font-bold text-stone-900 mb-2">Clientes</h1>
      <p className="text-stone-600 mb-8">
        {clientes.length} cliente{clientes.length !== 1 ? "s" : ""} registrado
        {clientes.length !== 1 ? "s" : ""}
      </p>

      <div className="card overflow-hidden">
        {clientesConAsistencias.length === 0 ? (
          <p className="text-stone-500 text-center py-10">No hay clientes aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 text-left">
                  <th className="px-5 py-3 font-medium text-stone-600">Nombre</th>
                  <th className="px-5 py-3 font-medium text-stone-600">Edad</th>
                  <th className="px-5 py-3 font-medium text-stone-600">Idiomas</th>
                  <th className="px-5 py-3 font-medium text-stone-600">Asistencias</th>
                  <th className="px-5 py-3 font-medium text-stone-600">Contacto</th>
                  <th className="px-5 py-3 font-medium text-stone-600">Registrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {clientesConAsistencias.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-stone-50">
                    <td className="px-5 py-3 font-medium text-stone-900">
                      {cliente.nombreCompleto}
                    </td>
                    <td className="px-5 py-3 text-stone-600">{cliente.edad}</td>
                    <td className="px-5 py-3 text-stone-600">{cliente.idiomas}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          cliente.asistencias >= 3
                            ? "bg-amber-100 text-amber-700"
                            : cliente.asistencias >= 1
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {cliente.asistencias} evento{cliente.asistencias !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-stone-600">
                      {cliente.telefono || cliente.email || "—"}
                    </td>
                    <td className="px-5 py-3 text-stone-500">{cliente.creadoEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
