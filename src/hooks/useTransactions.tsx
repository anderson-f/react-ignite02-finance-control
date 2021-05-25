import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  category: string;
  type: string;
  createdAt: string;
}

// interface TransactionInput {
//   title: string;
//   amount: number;
//   category: string;
//   type: string;
// }

// type TransactionInput = Pick<Transaction, 'title' | 'amount' | 'category' | 'type'>

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;


interface TransactionsProviderProps {
  children: ReactNode;
}

// Toda função assincrona por padrão retorna uma promisse
interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

// quando o tipo do typescript é um objeto
const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(()=>{
    api.get('transactions')
      .then(response => setTransactions(response.data.transactions))
  }, []);

  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post('/transactions', {
      ...transactionInput,
      createdAt: new Date() // isso é automatico com uma api real
    });
    const { transaction } = response.data

    setTransactions([
      ...transactions,
      transaction
    ]);
  }


  // retornando um objeto que contem a lista de transações e a função que cria uma transação
  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}
