"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(true);
  const [payload, setPayload] = useState({
    nama_barang: "",
    stok: "",
    jumlah_terjual: "",
    tanggal_transaksi: "",
    jenis_barang: "",
  });

  const convertIsoDate = (isoDate) => {
    const date = new Date(isoDate);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const localDate = date.toLocaleDateString();

    return localDate;
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };

  const handleInput = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (edit) {
        await axios.patch("/api/penjualan", {
          ...payload,
          tanggal_transaksi: formatDate(payload.tanggal_transaksi),
        });
      } else {
        await axios.post("/api/penjualan", payload);
      }
      setPayload({
        nama_barang: "",
        stok: "",
        jumlah_terjual: "",
        tanggal_transaksi: "",
        jenis_barang: "",
      });
      setVisible(false);
      setLoading(true);
      setEdit(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (penjualan) => {
    try {
      await axios.delete(`/api/penjualan/?id=${penjualan}`);
      setLoading(true);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const fetchData = async () => {
    const response = await fetch("/api/penjualan");
    const result = await response.json();
    setData(result.data);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [loading]);
  return (
    <div className="container">
      <div
        className="row"
        style={{ justifyContent: "center", margin: "50px 0px" }}
      >
        <div className="col-md-offset-1 col-md-10">
          <div className="panel">
            <div className="panel-heading">
              <div className="row">
                <div className="col col-sm-3 col-xs-12">
                  <h4 className="title">
                    Data <span>List</span>
                  </h4>
                </div>
                <div className="col-sm-9 col-xs-12 text-right">
                  <div className="btn_group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                    />
                    <button
                      className="btn btn-default"
                      onClick={() => setVisible(true)}
                    >
                      Add Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-body table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nama Barang</th>
                    <th>Stok</th>
                    <th>Jumlah Terjual</th>
                    <th>Tanggal Transaksi</th>
                    <th>Jenis Barang</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading &&
                    data.map((item, index) => (
                      <tr key={index}>
                        <td>1</td>
                        <td>{item.nama_barang}</td>
                        <td>{item.stok}</td>
                        <td>{item.jumlah_terjual}</td>
                        <td>{convertIsoDate(item.tanggal_transaksi)}</td>
                        <td>{item.jenis_barang}</td>
                        <td>
                          <ul className="action-list">
                            <li>
                              <button
                                style={{
                                  backgroundColor: "#ffc107",
                                  color: "white",
                                  padding: "8px",
                                  borderRadius: "8px",
                                }}
                                onClick={() => {
                                  setVisible(true);
                                  setPayload(item);
                                  setEdit(true);
                                }}
                              >
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                style={{
                                  backgroundColor: "#dc3545",
                                  color: "white",
                                  padding: "8px",
                                  borderRadius: "8px",
                                }}
                                onClick={() => handleDelete(item.id)}
                              >
                                Remove
                              </button>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {visible && (
                <div
                  className="modal"
                  onClick={() => {
                    setVisible(false);
                    setPayload({
                      nama_barang: "",
                      stok: "",
                      jumlah_terjual: "",
                      tanggal_transaksi: "",
                      jenis_barang: "",
                    });
                  }}
                >
                  <div
                    className="modalContent"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      className="closeBtn"
                      onClick={() => {
                        setVisible(false);
                        setPayload({
                          nama_barang: "",
                          stok: "",
                          jumlah_terjual: "",
                          tanggal_transaksi: "",
                          jenis_barang: "",
                        });
                      }}
                    >
                      &times;
                    </span>
                    <h2>Tambah Data Barang</h2>
                    <form onSubmit={handleSubmit}>
                      <label htmlFor="nama_barang">Nama Barang:</label>
                      <input
                        type="text"
                        id="nama_barang"
                        name="nama_barang"
                        onChange={(e) => handleInput(e)}
                        value={payload.nama_barang}
                        required
                      />

                      <label htmlFor="stok">Stok:</label>
                      <input
                        type="number"
                        id="stok"
                        name="stok"
                        onChange={(e) => handleInput(e)}
                        value={payload.stok}
                        required
                      />

                      <label htmlFor="jumlah_terjual">Jumlah Terjual:</label>
                      <input
                        type="number"
                        id="jumlah_terjual"
                        name="jumlah_terjual"
                        onChange={(e) => handleInput(e)}
                        value={payload.jumlah_terjual}
                        required
                      />

                      <label htmlFor="tanggal_transaksi">
                        Tanggal Transaksi:
                      </label>
                      <input
                        type="date"
                        id="tanggal_transaksi"
                        name="tanggal_transaksi"
                        onChange={(e) => handleInput(e)}
                        value={
                          payload.tanggal_transaksi === ""
                            ? payload.tanggal_transaksi
                            : formatDate(payload.tanggal_transaksi)
                        }
                        required
                      />

                      <label htmlFor="jenis_barang">Jenis Barang:</label>
                      <input
                        type="text"
                        id="jenis_barang"
                        name="jenis_barang"
                        onChange={(e) => handleInput(e)}
                        value={payload.jenis_barang}
                        required
                      />

                      <button
                        type="submit"
                        style={{
                          backgroundColor: "#2c3e50",
                          color: "white",
                          borderRadius: 8,
                          padding: 8,
                        }}
                      >
                        Kirim
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
