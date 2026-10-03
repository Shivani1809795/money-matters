import React, {useMemo, useState} from 'react'
import './App.css'

const initialTransactions = [
  {
    id: 1,
    name: 'Salary',
    category: 'Income',
    type: 'Credit',
    amount: 45000,
    date: '01 Oct 2026',
  },
  {
    id: 2,
    name: 'Shopping',
    category: 'Shopping',
    type: 'Debit',
    amount: 2500,
    date: '02 Oct 2026',
  },
  {
    id: 3,
    name: 'Electricity Bill',
    category: 'Bills',
    type: 'Debit',
    amount: 1800,
    date: '03 Oct 2026',
  },
  {
    id: 4,
    name: 'Freelance',
    category: 'Income',
    type: 'Credit',
    amount: 8000,
    date: '04 Oct 2026',
  },
  {
    id: 5,
    name: 'Food',
    category: 'Food',
    type: 'Debit',
    amount: 900,
    date: '05 Oct 2026',
  },
  {
    id: 6,
    name: 'Bonus',
    category: 'Income',
    type: 'Credit',
    amount: 5000,
    date: '06 Oct 2026',
  },
]

const emptyForm = {
  name: '',
  category: '',
  type: 'Debit',
  amount: '',
  date: '',
}

function App() {
  const [page, setPage] = useState('dashboard')
  const [userType, setUserType] = useState('user')
  const [transactions, setTransactions] = useState(initialTransactions)

  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [formData, setFormData] = useState(emptyForm)

  const [showDelete, setShowDelete] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  const totalCredit = useMemo(
    () =>
      transactions
        .filter(item => item.type === 'Credit')
        .reduce((total, item) => total + Number(item.amount), 0),
    [transactions],
  )

  const totalDebit = useMemo(
    () =>
      transactions
        .filter(item => item.type === 'Debit')
        .reduce((total, item) => total + Number(item.amount), 0),
    [transactions],
  )

  const balance = totalCredit - totalDebit

  const filteredTransactions = useMemo(() => {
    if (page === 'credit') {
      return transactions.filter(item => item.type === 'Credit')
    }

    if (page === 'debit') {
      return transactions.filter(item => item.type === 'Debit')
    }

    return transactions
  }, [page, transactions])

  const openAddForm = () => {
    setEditingTransaction(null)
    setFormData(emptyForm)
    setShowForm(true)
  }

  const openEditForm = transaction => {
    setEditingTransaction(transaction)

    setFormData({
      name: transaction.name,
      category: transaction.category,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
    })

    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingTransaction(null)
    setFormData(emptyForm)
  }

  const handleInputChange = event => {
    const {name, value} = event.target

    setFormData(previous => ({
      ...previous,
      [name]: value,
    }))
  }

  const saveTransaction = event => {
    event.preventDefault()

    if (
      formData.name.trim() === '' ||
      formData.category.trim() === '' ||
      formData.amount === ''
    ) {
      alert('Please fill all required fields')
      return
    }

    if (editingTransaction) {
      setTransactions(previous =>
        previous.map(item =>
          item.id === editingTransaction.id
            ? {
                ...item,
                ...formData,
                amount: Number(formData.amount),
              }
            : item,
        ),
      )
    } else {
      const newTransaction = {
        id: Date.now(),
        ...formData,
        amount: Number(formData.amount),
      }

      setTransactions(previous => [newTransaction, ...previous])
    }

    closeForm()
  }

  const deleteTransaction = id => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this transaction?',
    )

    if (shouldDelete) {
      setTransactions(previous =>
        previous.filter(transaction => transaction.id !== id),
      )
    }
  }

  const deleteAccount = () => {
    setShowDelete(false)
    alert('Account deleted successfully')
  }

  const logout = () => {
    setShowLogout(false)
    setPage('dashboard')
    setUserType('user')
  }

  const changePage = selectedPage => {
    setPage(selectedPage)
  }

  const switchToAdmin = () => {
    setUserType('admin')
    setPage('admin-dashboard')
  }

  const switchToUser = () => {
    setUserType('user')
    setPage('dashboard')
  }

  return (
    <div className="app">
      {userType === 'user' ? (
        <UserSidebar
          page={page}
          changePage={changePage}
          switchToAdmin={switchToAdmin}
          setShowLogout={setShowLogout}
        />
      ) : (
        <AdminSidebar
          page={page}
          changePage={changePage}
          switchToUser={switchToUser}
          setShowLogout={setShowLogout}
        />
      )}

      <main className="main-content">
        <Header
          userType={userType}
          page={page}
          onAdd={openAddForm}
        />

        {userType === 'user' ? (
          <>
            {page === 'dashboard' && (
              <Dashboard
                transactions={transactions}
                balance={balance}
                totalCredit={totalCredit}
                totalDebit={totalDebit}
                onAdd={openAddForm}
                onEdit={openEditForm}
              />
            )}

            {['all', 'debit', 'credit'].includes(page) && (
              <TransactionsPage
                title={
                  page === 'all'
                    ? 'All Transactions'
                    : page === 'debit'
                      ? 'Debit Transactions'
                      : 'Credit Transactions'
                }
                transactions={filteredTransactions}
                onAdd={openAddForm}
                onEdit={openEditForm}
                onDelete={deleteTransaction}
              />
            )}

            {page === 'profile' && <Profile />}

            {page === 'delete' && (
              <DeleteAccount onDelete={() => setShowDelete(true)} />
            )}
          </>
        ) : (
          <>
            {page === 'admin-dashboard' && (
              <AdminDashboard
                transactions={transactions}
                totalCredit={totalCredit}
                totalDebit={totalDebit}
                balance={balance}
              />
            )}

            {page === 'admin-transactions' && (
              <TransactionsPage
                title="All Transactions"
                transactions={transactions}
                admin
              />
            )}
          </>
        )}
      </main>

      {showForm && (
        <TransactionModal
          formData={formData}
          editingTransaction={editingTransaction}
          onChange={handleInputChange}
          onSave={saveTransaction}
          onClose={closeForm}
        />
      )}

      {showDelete && (
        <ConfirmModal
          title="Delete Account"
          message="Are you sure you want to delete your account?"
          confirmText="Delete"
          onConfirm={deleteAccount}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {showLogout && (
        <ConfirmModal
          title="Logout"
          message="Are you sure you want to logout?"
          confirmText="Logout"
          onConfirm={logout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </div>
  )
}

function UserSidebar({
  page,
  changePage,
  switchToAdmin,
  setShowLogout,
}) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">₹</div>
        <h2>Money Matters</h2>
      </div>

      <nav>
        <SidebarButton
          active={page === 'dashboard'}
          icon="⌂"
          text="Dashboard"
          onClick={() => changePage('dashboard')}
        />

        <SidebarButton
          active={page === 'all'}
          icon="▦"
          text="All Transactions"
          onClick={() => changePage('all')}
        />

        <SidebarButton
          active={page === 'debit'}
          icon="↓"
          text="Debit"
          onClick={() => changePage('debit')}
        />

        <SidebarButton
          active={page === 'credit'}
          icon="↑"
          text="Credit"
          onClick={() => changePage('credit')}
        />

        <SidebarButton
          active={page === 'profile'}
          icon="○"
          text="Profile"
          onClick={() => changePage('profile')}
        />

        <SidebarButton
          active={page === 'delete'}
          icon="⌫"
          text="Delete"
          onClick={() => changePage('delete')}
        />

        <SidebarButton
          icon="↪"
          text="Logout"
          onClick={() => setShowLogout(true)}
        />
      </nav>

      <button className="admin-switch" onClick={switchToAdmin}>
        Switch to Admin
      </button>
    </aside>
  )
}

function AdminSidebar({
  page,
  changePage,
  switchToUser,
  setShowLogout,
}) {
  return (
    <aside className="sidebar admin-sidebar">
      <div className="logo">
        <div className="logo-icon">₹</div>
        <h2>Money Matters</h2>
      </div>

      <div className="admin-title">ADMIN PANEL</div>

      <nav>
        <SidebarButton
          active={page === 'admin-dashboard'}
          icon="⌂"
          text="Dashboard"
          onClick={() => changePage('admin-dashboard')}
        />

        <SidebarButton
          active={page === 'admin-transactions'}
          icon="▦"
          text="All Transactions"
          onClick={() => changePage('admin-transactions')}
        />

        <SidebarButton
          icon="←"
          text="User View"
          onClick={switchToUser}
        />

        <SidebarButton
          icon="↪"
          text="Logout"
          onClick={() => setShowLogout(true)}
        />
      </nav>
    </aside>
  )
}

function SidebarButton({active, icon, text, onClick}) {
  return (
    <button
      className={`sidebar-button ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span>{icon}</span>
      {text}
    </button>
  )
}

function Header({userType, page, onAdd}) {
  const getTitle = () => {
    if (userType === 'admin') {
      return page === 'admin-transactions'
        ? 'All Transactions'
        : 'Admin Dashboard'
    }

    if (page === 'dashboard') return 'Dashboard'
    if (page === 'all') return 'All Transactions'
    if (page === 'debit') return 'Debit'
    if (page === 'credit') return 'Credit'
    if (page === 'profile') return 'Profile'
    if (page === 'delete') return 'Delete Account'

    return 'Money Matters'
  }

  return (
    <header className="top-header">
      <div>
        <p className="welcome-text">
          {userType === 'admin' ? 'Welcome Admin' : 'Welcome back'}
        </p>
        <h1>{getTitle()}</h1>
      </div>

      {userType === 'user' && (
        <button className="add-button" onClick={onAdd}>
          + Add Transaction
        </button>
      )}
    </header>
  )
}

function SummaryCards({balance, totalCredit, totalDebit}) {
  return (
    <div className="summary-grid">
      <div className="summary-card balance-card">
        <div className="summary-icon">₹</div>
        <div>
          <p>Current Balance</p>
          <h2>₹{balance.toLocaleString('en-IN')}</h2>
        </div>
      </div>

      <div className="summary-card credit-card">
        <div className="summary-icon">↑</div>
        <div>
          <p>Total Credit</p>
          <h2>₹{totalCredit.toLocaleString('en-IN')}</h2>
        </div>
      </div>

      <div className="summary-card debit-card">
        <div className="summary-icon">↓</div>
        <div>
          <p>Total Debit</p>
          <h2>₹{totalDebit.toLocaleString('en-IN')}</h2>
        </div>
      </div>
    </div>
  )
}

function Dashboard({
  transactions,
  balance,
  totalCredit,
  totalDebit,
  onAdd,
  onEdit,
}) {
  return (
    <div className="page-container">
      <SummaryCards
        balance={balance}
        totalCredit={totalCredit}
        totalDebit={totalDebit}
      />

      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h2>Money Overview</h2>
              <p>Your credit and debit summary</p>
            </div>
          </div>

          <MoneyChart
            totalCredit={totalCredit}
            totalDebit={totalDebit}
          />
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Manage your money</p>
            </div>
          </div>

          <button className="quick-add" onClick={onAdd}>
            <span>+</span>
            Add Transaction
          </button>

          <div className="quick-info">
            <strong>Balance</strong>
            <span>₹{balance.toLocaleString('en-IN')}</span>
          </div>

          <div className="quick-info">
            <strong>Transactions</strong>
            <span>{transactions.length}</span>
          </div>
        </section>
      </div>

      <section className="panel recent-panel">
        <div className="panel-header">
          <div>
            <h2>Recent Transactions</h2>
            <p>Your latest money activity</p>
          </div>
        </div>

        <TransactionTable
          transactions={transactions.slice(0, 5)}
          onEdit={onEdit}
        />
      </section>
    </div>
  )
}

function MoneyChart({totalCredit, totalDebit}) {
  const maximum = Math.max(totalCredit, totalDebit, 1)

  const creditHeight = Math.max(
    10,
    (totalCredit / maximum) * 180,
  )

  const debitHeight = Math.max(
    10,
    (totalDebit / maximum) * 180,
  )

  return (
    <div className="chart">
      <div className="chart-bars">
        <div className="bar-wrapper">
          <div
            className="bar credit-bar"
            style={{height: `${creditHeight}px`}}
          />
          <span>Credit</span>
        </div>

        <div className="bar-wrapper">
          <div
            className="bar debit-bar"
            style={{height: `${debitHeight}px`}}
          />
          <span>Debit</span>
        </div>
      </div>

      <div className="chart-values">
        <span>₹{totalCredit.toLocaleString('en-IN')}</span>
        <span>₹{totalDebit.toLocaleString('en-IN')}</span>
      </div>
    </div>
  )
}

function TransactionsPage({
  title,
  transactions,
  onAdd,
  onEdit,
  onDelete,
  admin = false,
}) {
  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <h2>{title}</h2>
          <p>{transactions.length} transaction(s)</p>
        </div>

        {!admin && (
          <button className="add-button" onClick={onAdd}>
            + Add Transaction
          </button>
        )}
      </div>

      <section className="panel">
        <TransactionTable
          transactions={transactions}
          onEdit={onEdit}
          onDelete={onDelete}
          admin={admin}
        />
      </section>
    </div>
  )
}

function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  admin = false,
}) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">₹</div>
        <h3>No Transactions</h3>
        <p>There are no transactions to display.</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            {!admin && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>
                <strong>{transaction.name}</strong>
              </td>

              <td>{transaction.category}</td>

              <td>
                <span
                  className={`type-badge ${transaction.type.toLowerCase()}`}
                >
                  {transaction.type}
                </span>
              </td>

              <td
                className={
                  transaction.type === 'Credit'
                    ? 'amount credit-text'
                    : 'amount debit-text'
                }
              >
                {transaction.type === 'Credit' ? '+' : '-'}₹
                {Number(transaction.amount).toLocaleString('en-IN')}
              </td>

              <td>{transaction.date}</td>

              {!admin && (
                <td>
                  <div className="table-actions">
                    <button
                      className="edit-button"
                      onClick={() => onEdit(transaction)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => onDelete(transaction.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Profile() {
  return (
    <div className="page-container">
      <section className="profile-card">
        <div className="profile-avatar">S</div>

        <h2>Shivani</h2>
        <p>Money Matters User</p>

        <div className="profile-details">
          <div>
            <span>Name</span>
            <strong>Shivani</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>shivani@example.com</strong>
          </div>

          <div>
            <span>Account Type</span>
            <strong>Personal</strong>
          </div>
        </div>

        <button
          className="primary-button"
          onClick={() => alert('Profile editing can be connected to your API')}
        >
          Edit Profile
        </button>
      </section>
    </div>
  )
}

function DeleteAccount({onDelete}) {
  return (
    <div className="page-container">
      <section className="danger-card">
        <div className="danger-icon">!</div>

        <h2>Delete Account</h2>

        <p>
          Deleting your account is permanent. All your account information
          and transactions may be removed.
        </p>

        <button className="danger-button" onClick={onDelete}>
          Delete My Account
        </button>
      </section>
    </div>
  )
}

function AdminDashboard({
  transactions,
  totalCredit,
  totalDebit,
  balance,
}) {
  return (
    <div className="page-container">
      <div className="admin-banner">
        <div>
          <span>ADMIN</span>
          <h2>Money Matters Administration</h2>
          <p>Monitor transactions and application activity.</p>
        </div>
      </div>

      <SummaryCards
        balance={balance}
        totalCredit={totalCredit}
        totalDebit={totalDebit}
      />

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Transaction Statistics</h2>
            <p>Current application data</p>
          </div>
        </div>

        <div className="admin-stats">
          <div>
            <span>Total Transactions</span>
            <strong>{transactions.length}</strong>
          </div>

          <div>
            <span>Total Credit</span>
            <strong>₹{totalCredit.toLocaleString('en-IN')}</strong>
          </div>

          <div>
            <span>Total Debit</span>
            <strong>₹{totalDebit.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </section>
    </div>
  )
}

function TransactionModal({
  formData,
  editingTransaction,
  onChange,
  onSave,
  onClose,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>
              {editingTransaction
                ? 'Edit Transaction'
                : 'Add Transaction'}
            </h2>

            <p>
              {editingTransaction
                ? 'Update transaction details'
                : 'Enter your transaction details'}
            </p>
          </div>

          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={onSave}>
          <div className="form-group">
            <label htmlFor="name">Transaction Name</label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Example: Salary"
              value={formData.name}
              onChange={onChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>

              <input
                id="category"
                name="category"
                type="text"
                placeholder="Example: Income"
                value={formData.category}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Type</label>

              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={onChange}
              >
                <option value="Debit">Debit</option>
                <option value="Credit">Credit</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount</label>

              <input
                id="amount"
                name="amount"
                type="number"
                min="0"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>

              <input
                id="date"
                name="date"
                type="text"
                placeholder="Example: 07 Oct 2026"
                value={formData.date}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="primary-button">
              {editingTransaction
                ? 'Update Transaction'
                : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ConfirmModal({
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-icon">!</div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>

          <button className="danger-button" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App