import React, {useState} from 'react'
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
]

function App() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [page, setPage] = useState('Dashboard')
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    name: '',
    category: '',
    type: 'Debit',
    amount: '',
    date: '',
  })

  const credit = transactions
    .filter(item => item.type === 'Credit')
    .reduce((sum, item) => sum + Number(item.amount), 0)

  const debit = transactions
    .filter(item => item.type === 'Debit')
    .reduce((sum, item) => sum + Number(item.amount), 0)

  const balance = credit - debit

  const addTransaction = event => {
    event.preventDefault()

    if (!form.name || !form.category || !form.amount || !form.date) {
      alert('Please fill all fields')
      return
    }

    const newTransaction = {
      id: Date.now(),
      ...form,
      amount: Number(form.amount),
    }

    setTransactions([newTransaction, ...transactions])

    setForm({
      name: '',
      category: '',
      type: 'Debit',
      amount: '',
      date: '',
    })

    setShowForm(false)
  }

  const deleteTransaction = id => {
    setTransactions(
      transactions.filter(transaction => transaction.id !== id),
    )
  }

  const displayedTransactions =
    page === 'Credit'
      ? transactions.filter(item => item.type === 'Credit')
      : page === 'Debit'
        ? transactions.filter(item => item.type === 'Debit')
        : transactions

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">₹</div>
          <h2>Money Matters</h2>
        </div>

        <button
          className={page === 'Dashboard' ? 'nav active' : 'nav'}
          onClick={() => setPage('Dashboard')}
        >
          🏠 Dashboard
        </button>

        <button
          className={page === 'All Transactions' ? 'nav active' : 'nav'}
          onClick={() => setPage('All Transactions')}
        >
          📋 All Transactions
        </button>

        <button
          className={page === 'Debit' ? 'nav active' : 'nav'}
          onClick={() => setPage('Debit')}
        >
          ↓ Debit
        </button>

        <button
          className={page === 'Credit' ? 'nav active' : 'nav'}
          onClick={() => setPage('Credit')}
        >
          ↑ Credit
        </button>

        <button
          className={page === 'Profile' ? 'nav active' : 'nav'}
          onClick={() => setPage('Profile')}
        >
          👤 Profile
        </button>

        <button
          className="nav"
          onClick={() => alert('Logout successful')}
        >
          🚪 Logout
        </button>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <p>Welcome back</p>
            <h1>{page}</h1>
          </div>

          <button
            className="add-btn"
            onClick={() => setShowForm(true)}
          >
            + Add Transaction
          </button>
        </header>

        {page === 'Dashboard' && (
          <>
            <section className="cards">
              <div className="card balance">
                <span>Current Balance</span>
                <h2>₹{balance.toLocaleString('en-IN')}</h2>
              </div>

              <div className="card credit">
                <span>Total Credit</span>
                <h2>₹{credit.toLocaleString('en-IN')}</h2>
              </div>

              <div className="card debit">
                <span>Total Debit</span>
                <h2>₹{debit.toLocaleString('en-IN')}</h2>
              </div>
            </section>

            <section className="panel">
              <h2>Money Overview</h2>

              <div className="overview">
                <div>
                  <div
                    className="bar green"
                    style={{
                      height: `${Math.max(credit / 300, 30)}px`,
                    }}
                  />
                  <p>Credit</p>
                </div>

                <div>
                  <div
                    className="bar red"
                    style={{
                      height: `${Math.max(debit / 100, 30)}px`,
                    }}
                  />
                  <p>Debit</p>
                </div>
              </div>
            </section>
          </>
        )}

        {page === 'Profile' && (
          <section className="profile">
            <div className="avatar">S</div>
            <h2>Shivani</h2>
            <p>Money Matters User</p>

            <div className="profile-row">
              <span>Name</span>
              <strong>Shivani</strong>
            </div>

            <div className="profile-row">
              <span>Email</span>
              <strong>shivani@example.com</strong>
            </div>

            <div className="profile-row">
              <span>Account</span>
              <strong>Personal</strong>
            </div>
          </section>
        )}

        {page !== 'Dashboard' && page !== 'Profile' && (
          <section className="panel">
            <div className="table-heading">
              <div>
                <h2>{page}</h2>
                <p>{displayedTransactions.length} transactions</p>
              </div>

              <button
                className="add-btn"
                onClick={() => setShowForm(true)}
              >
                + Add
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedTransactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{transaction.name}</td>
                      <td>{transaction.category}</td>

                      <td>
                        <span
                          className={
                            transaction.type === 'Credit'
                              ? 'badge credit-badge'
                              : 'badge debit-badge'
                          }
                        >
                          {transaction.type}
                        </span>
                      </td>

                      <td
                        className={
                          transaction.type === 'Credit'
                            ? 'green-text'
                            : 'red-text'
                        }
                      >
                        {transaction.type === 'Credit' ? '+' : '-'}₹
                        {Number(transaction.amount).toLocaleString(
                          'en-IN',
                        )}
                      </td>

                      <td>{transaction.date}</td>

                      <td>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteTransaction(transaction.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {showForm && (
        <div className="overlay">
          <div className="modal">
            <button
              className="close"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>

            <h2>Add Transaction</h2>

            <form onSubmit={addTransaction}>
              <label>Transaction Name</label>
              <input
                type="text"
                placeholder="Salary"
                value={form.name}
                onChange={event =>
                  setForm({...form, name: event.target.value})
                }
              />

              <label>Category</label>
              <input
                type="text"
                placeholder="Income"
                value={form.category}
                onChange={event =>
                  setForm({...form, category: event.target.value})
                }
              />

              <label>Type</label>
              <select
                value={form.type}
                onChange={event =>
                  setForm({...form, type: event.target.value})
                }
              >
                <option value="Debit">Debit</option>
                <option value="Credit">Credit</option>
              </select>

              <label>Amount</label>
              <input
                type="number"
                placeholder="5000"
                value={form.amount}
                onChange={event =>
                  setForm({...form, amount: event.target.value})
                }
              />

              <label>Date</label>
              <input
                type="text"
                placeholder="07 Oct 2026"
                value={form.date}
                onChange={event =>
                  setForm({...form, date: event.target.value})
                }
              />

              <button className="save-btn" type="submit">
                Add Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App