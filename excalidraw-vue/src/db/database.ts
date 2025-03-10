import { openDB, type DBSchema } from 'idb';

// 定义数据库的类型结构
interface ExcalidrawDemoDB extends DBSchema {
  documents: {
    key: string;
    value: any;
  };
  recents: {
    key: string;
    value: {
      id: string;
      name: string;
      date: number;
      image: string;
    };
  };
  files: {
    key: string;
    value: {
      mimeType: string;
      id: string;
      dataURL: string;
      created: number;
      lastRetrieved: number;
    };
  };
}

class Database {
  private db: any = null;
  private static instance: Database;

  private constructor() {}

  // 单例模式
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // 初始化数据库
  async init() {
    if (!this.db) {
      this.db = await openDB<ExcalidrawDemoDB>('excalidraw-demo-db', 1, {
        upgrade(db) {
          // 创建文档存储
          if (!db.objectStoreNames.contains('documents')) {
            db.createObjectStore('documents');
          }
          // 创建最近文件存储
          if (!db.objectStoreNames.contains('recents')) {
            db.createObjectStore('recents');
          }
          // 创建文件存储
          if (!db.objectStoreNames.contains('files')) {
            db.createObjectStore('files');
          }
        },
      });
    }
    return this.db;
  }

  // Documents 相关操作
  async saveDocument(key: string, value: any) {
    const db = await this.init();
    return db.put('documents', value, key);
  }

  async getDocument(key: string) {
    const db = await this.init();
    return db.get('documents', key);
  }

  // Recents 相关操作
  async saveRecent(item: {
    id: string;
    name: string;
    date: number;
    image: string;
  }) {
    const db = await this.init();
    return db.put('recents', item, item.id);
  }

  async getRecentItems() {
    const db = await this.init();
    return db.getAll('recents');
  }

  // Files 相关操作
  async saveFile(item: {
    mimeType: string;
    id: string;
    dataURL: string;
    created: number;
    lastRetrieved: number;
  }) {
    const db = await this.init();
    return db.put('files', item, item.id);
  }

  async getFile(id: string) {
    const db = await this.init();
    return db.get('files', id);
  }

  // 通用删除方法
  async deleteItem(storeName: 'documents' | 'recents' | 'files', key: string) {
    const db = await this.init();
    return db.delete(storeName, key);
  }
}

export const db = Database.getInstance(); 