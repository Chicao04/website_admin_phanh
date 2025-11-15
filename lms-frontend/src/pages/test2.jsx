// src/pages/UserManagement.jsx
import { useEffect, useState } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../api';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // form: thêm + sửa
    const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);    // <== mới

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'student',
    });

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await fetchUsers({ search, role: roleFilter });
            setUsers(data);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error loading users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resetForm = () => {
        setFormMode('create');
        setEditingId(null);
        setForm({
            name: '',
            email: '',
            password: '',
            phone: '',
            role: 'student',
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadUsers();
    };

    // Bấm nút "+ Thêm tài khoản"
    const handleAddClick = () => {
        resetForm();
        setShowForm(true); // mở form
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formMode === 'create') {
                if (!form.password) {
                    alert('Password là bắt buộc khi tạo mới');
                    return;
                }
                await createUser(form);
            } else {
                const { password, ...rest } = form; // sửa thì không bắt buộc đổi pass
                await updateUser(editingId, rest);
            }

            resetForm();
            setShowForm(false); // gửi xong thì ẩn form
            await loadUsers();
        } catch (err) {
            console.error(err);
            alert(err.message || 'Có lỗi xảy ra');
        }
    };

    const handleEditClick = (user) => {
        setFormMode('edit');
        setEditingId(user.id);
        setForm({
            name: user.name || '',
            email: user.email || '',
            password: '',
            phone: user.phone || '',
            role: user.role || 'student',
        });
        setShowForm(true); // mở form khi sửa
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (user) => {
        const ok = window.confirm(
            `Bạn có chắc muốn xóa tài khoản "${user.name}"?`
        );
        if (!ok) return;

        try {
            await deleteUser(user.id);
            await loadUsers();
        } catch (err) {
            console.error(err);
            alert(err.message || 'Xóa tài khoản thất bại');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                height: '100vh',          // full chiều cao màn hình
                background: '#f5f5f5',
            }}
        >
            {/* Sidebar bên trái */}
            <aside
                style={{
                    width: 230,
                    background: '#263238',
                    color: 'white',
                    padding: '16px 0',
                }}
            >
                <div style={{ padding: '0 16px', marginBottom: 16, fontWeight: 'bold' }}>
                    LMS Admin
                </div>
                <div style={{ fontSize: 13, opacity: 0.7, padding: '0 16px 8px' }}>
                    HỆ THỐNG
                </div>
                <nav>
                    <div
                        style={{
                            padding: '8px 16px',
                            background: '#1565c0',
                            cursor: 'default',
                        }}
                    >
                        Quản lý người dùng
                    </div>
                </nav>
            </aside>

            {/* Nội dung chính */}
            <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
                <h2 style={{ marginBottom: 16 }}>Quản lý User</h2>

                {/* Thanh search + bộ lọc + nút Thêm tài khoản */}
                <div
                    style={{
                        background: 'white',
                        padding: 16,
                        borderRadius: 4,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        marginBottom: 16,
                    }}
                >
                    <form
                        onSubmit={handleSearchSubmit}
                        style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center',
                            marginBottom: 8,
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Tên, Email, SĐT..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ flex: 1, padding: 8 }}
                        />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            style={{ padding: 8 }}
                        >
                            <option value="all">Tất cả vai trò</option>
                            <option value="student">Student</option>
                            <option value="lecture">Lecture</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button
                            type="submit"
                            style={{
                                padding: '8px 16px',
                                background: '#1976d2',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                            }}
                        >
                            Tìm kiếm
                        </button>
                    </form>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            type="button"
                            onClick={handleAddClick}
                            style={{
                                padding: '6px 12px',
                                background: '#1976d2',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                            }}
                        >
                            + Thêm tài khoản
                        </button>
                    </div>
                </div>

                {/* Form thêm / sửa: chỉ hiện khi showForm = true */}
                {showForm && (
                    <div
                        style={{
                            background: 'white',
                            padding: 16,
                            borderRadius: 4,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            marginBottom: 16,
                        }}
                    >
                        <h3 style={{ marginTop: 0 }}>
                            {formMode === 'create' ? 'Thêm tài khoản mới' : 'Sửa tài khoản'}
                        </h3>

                        <form
                            onSubmit={handleFormSubmit}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                gap: 12,
                                alignItems: 'center',
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Họ tên"
                                value={form.name}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, name: e.target.value }))
                                }
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, email: e.target.value }))
                                }
                                required
                            />
                            {formMode === 'create' && (
                                <input
                                    type="password"
                                    placeholder="Mật khẩu"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            password: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            )}
                            <input
                                type="text"
                                placeholder="Số điện thoại"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                                }
                            />
                            <select
                                value={form.role}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, role: e.target.value }))
                                }
                            >
                                <option value="student">Student</option>
                                <option value="lecture">Lecture</option>
                                <option value="admin">Admin</option>
                            </select>

                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '6px 16px',
                                        background: '#2e7d32',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {formMode === 'create' ? 'Tạo mới' : 'Lưu thay đổi'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setShowForm(false); // ẩn form khi bấm Hủy
                                    }}
                                    style={{
                                        padding: '6px 16px',
                                        background: '#9e9e9e',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Bảng danh sách tài khoản */}
                <div
                    style={{
                        background: 'white',
                        padding: 16,
                        borderRadius: 4,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                >
                    {loading && <p>Đang tải danh sách...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {!loading && (
                        <>
                            <table
                                width="100%"
                                border="1"
                                cellPadding="8"
                                cellSpacing="0"
                                style={{ borderCollapse: 'collapse', fontSize: 14 }}
                            >
                                <thead style={{ background: '#1976d2', color: 'white' }}>
                                    <tr>
                                        <th style={{ width: 80 }}>Mã</th>
                                        <th>Họ tên</th>
                                        <th>Email</th>
                                        <th>SĐT</th>
                                        <th>Vai trò</th>
                                        <th>Ngày tạo</th>
                                        <th style={{ width: 120 }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.phone}</td>
                                            <td>{u.role}</td>
                                            <td>
                                                {u.created_at
                                                    ? new Date(u.created_at).toLocaleString()
                                                    : ''}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditClick(u)}
                                                    style={{
                                                        marginRight: 4,
                                                        padding: '4px 8px',
                                                        background: '#ffb300',
                                                        border: 'none',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick(u)}
                                                    style={{
                                                        padding: '4px 8px',
                                                        background: '#e53935',
                                                        border: 'none',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={7} style={{ textAlign: 'center' }}>
                                                Không có tài khoản nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div style={{ marginTop: 8, fontSize: 13 }}>
                                Tổng: {users.length} tài khoản
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
