import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM Barang");
    return NextResponse.json(
      { message: "Data Data Penjualan berhasil diambil!", data: rows },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Gagal mengambil data Data Penjualan!" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const {
      nama_barang,
      stok,
      jumlah_terjual,
      tanggal_transaksi,
      jenis_barang,
    } = await req.json();

    console.log(
      nama_barang,
      stok,
      jumlah_terjual,
      tanggal_transaksi,
      jenis_barang
    );

    const [result] = await pool.query(
      "INSERT INTO Barang (nama_barang, stok,  jumlah_terjual,  tanggal_transaksi,  jenis_barang) VALUES (?, ?, ?, ?, ?)",
      [nama_barang, stok, jumlah_terjual, tanggal_transaksi, jenis_barang]
    );

    return NextResponse.json(
      {
        message: "Data Penjualan berhasil dibuat!",
        // data: {
        //   id: result.insertId,
        //   nama_barang,
        //   stok,
        //   jumlah_terjual,
        //   tanggal_transaksi,
        //   jenis_barang,
        // },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Gagal membuat Data Penjualan!" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const {
      id,
      nama_barang,
      stok,
      jumlah_terjual,
      tanggal_transaksi,
      jenis_barang,
    } = await req.json();

    const [result] = await pool.query(
      "UPDATE Barang SET nama_barang = ?, stok = ?, jumlah_terjual = ?, tanggal_transaksi = ?, jenis_barang = ? WHERE id = ?",
      [nama_barang, stok, jumlah_terjual, tanggal_transaksi, jenis_barang, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Data Penjualan tidak ditemukan!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Data Penjualan berhasil diperbarui!",
        data: {
          id,
          nama_barang,
          stok,
          jumlah_terjual,
          tanggal_transaksi,
          jenis_barang
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Gagal memperbarui Data Penjualan!" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id") ?? "";

    const [result] = await pool.query("DELETE FROM Barang WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Data Penjualan tidak ditemukan!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Penjualan berhasil dihapus!" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Gagal menghapus Data Penjualan!" },
      { status: 500 }
    );
  }
}
