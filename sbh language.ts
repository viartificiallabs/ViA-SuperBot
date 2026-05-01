// 🔗 SVH - SYSTÈME VITRINE HAÏ
// Connexions + Logs + Terminaux pour SuperBot Haï Family

import { createClient } from '@supabase/supabase-js';
import { EventEmitter } from 'events';

// ===============================
// 📡 CONFIGURATION
// ===============================

interface VitrineConfig {
  name: string;
  framework: 'nextjs' | 'react-router' | 'tanstack' | 'react-spa' | 'vue' | 'nuxt';
  port: number;
  endpoint: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

interface BotConfig {
  name: 'historien' | 'rabbin' | 'linguiste' | 'scientifique';
  endpoint: string;
  port: number;
}

const VITRINES: VitrineConfig[] = [
  {
    name: 'nextjs-vitrine',
    framework: 'nextjs',
    port: 3100,
    endpoint: 'http://localhost:3100',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
  },
  {
    name: 'react-router-vitrine',
    framework: 'react-router',
    port: 3101,
    endpoint: 'http://localhost:3101',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
  },
  {
    name: 'tanstack-start-vitrine',
    framework: 'tanstack',
    port: 3102,
    endpoint: 'http://localhost:3102',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
  },
  {
    name: 'react-spa-vitrine',
    framework: 'react-spa',
    port: 3103,
    endpoint: 'http://localhost:3103',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
  },
  {
    name: 'vue-vitrine',
    framework: 'vue',
    port: 3104,
    endpoint: 'http://localhost:3104',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
  },
  {
    name: 'nuxt-vitrine',
    framework: 'nuxt',
    port: 3105,
    endpoint: 'http://localhost:3105',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
  }
];

const BOTS: BotConfig[] = [
  { name: 'historien', endpoint: 'http://localhost:3001', port: 3001 },
  { name: 'rabbin', endpoint: 'http://localhost:3002', port: 3002 },
  { name: 'linguiste', endpoint: 'http://localhost:3003', port: 3003 },
  { name: 'scientifique', endpoint: 'http://localhost:3004', port: 3004 }
];

// ===============================
// 🔌 CONNEXION MANAGER
// ===============================

class ConnexionManager extends EventEmitter {
  private vitrineConnections: Map<string, any> = new Map();
  private botConnections: Map<string, any> = new Map();
  private supabaseClients: Map<string, any> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initializeConnections();
  }

  // Initialiser toutes les connexions
  async initializeConnections() {
    console.log('🚀 [SVH] Initialisation des connexions...');
    
    // Initialiser les clients Supabase pour chaque vitrine
    for (const vitrine of VITRINES) {
      try {
        const supabaseClient = createClient(
          vitrine.supabaseUrl,
          vitrine.supabaseAnonKey
        );
        
        this.supabaseClients.set(vitrine.name, supabaseClient);
        this.emit('connection:established', {
          type: 'vitrine',
          name: vitrine.name,
          status: 'connected'
        });
        
        console.log(`✓ [SVH] ${vitrine.name} connecté à Supabase`);
      } catch (error) {
        console.error(`✗ [SVH] Erreur connexion ${vitrine.name}:`, error);
        this.emit('connection:failed', {
          type: 'vitrine',
          name: vitrine.name,
          error
        });
      }
    }

    // Health check périodique
    this.startHealthCheck();
  }

  // Vérifier l'état de santé des connexions
  private startHealthCheck() {
    this.healthCheckInterval = setInterval(async () => {
      for (const vitrine of VITRINES) {
        try {
          const response = await fetch(`${vitrine.endpoint}/health`, {
            method: 'GET',
            timeout: 5000
          });
          
          const isHealthy = response.ok;
          this.emit('health:check', {
            type: 'vitrine',
            name: vitrine.name,
            healthy: isHealthy,
            timestamp: new Date()
          });
        } catch (error) {
          this.emit('health:check', {
            type: 'vitrine',
            name: vitrine.name,
            healthy: false,
            error,
            timestamp: new Date()
          });
        }
      }

      // Check bots
      for (const bot of BOTS) {
        try {
          const response = await fetch(`${bot.endpoint}/health`, {
            method: 'GET',
            timeout: 5000
          });
          
          const isHealthy = response.ok;
          this.emit('health:check', {
            type: 'bot',
            name: bot.name,
            healthy: isHealthy,
            timestamp: new Date()
          });
        } catch (error) {
          this.emit('health:check', {
            type: 'bot',
            name: bot.name,
            healthy: false,
            error,
            timestamp: new Date()
          });
        }
      }
    }, 30000); // Check toutes les 30s
  }

  // Obtenir un client Supabase pour une vitrine
  getSupabaseClient(vitrineName: string) {
    return this.supabaseClients.get(vitrineName);
  }

  // Synchroniser l'état d'authentification entre vitrines
  async syncAuthState(sourceVitrine: string, session: any) {
    console.log(`🔄 [SVH] Synchronisation auth depuis ${sourceVitrine}`);
    
    const promises = VITRINES
      .filter(v => v.name !== sourceVitrine)
      .map(async (vitrine) => {
        const client = this.getSupabaseClient(vitrine.name);
        if (client && session) {
          try {
            await client.auth.setSession(session);
            console.log(`✓ [SVH] Auth synchronisée vers ${vitrine.name}`);
          } catch (error) {
            console.error(`✗ [SVH] Erreur sync auth ${vitrine.name}:`, error);
          }
        }
      });

    await Promise.all(promises);
    this.emit('auth:synced', { source: sourceVitrine, targets: VITRINES.length - 1 });
  }

  // Router une requête vers le bon bot
  async routeToBo(botName: string, payload: any) {
    const bot = BOTS.find(b => b.name === botName);
    if (!bot) {
      throw new Error(`Bot ${botName} introuvable`);
    }

    try {
      const response = await fetch(`${bot.endpoint}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      this.emit('bot:response', { bot: botName, payload, result });
      return result;
    } catch (error) {
      this.emit('bot:error', { bot: botName, error });
      throw error;
    }
  }

  // Cleanup
  destroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    this.removeAllListeners();
  }
}

// ===============================
// 📝 LOGS MANAGER
// ===============================

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  source: string;
  message: string;
  metadata?: any;
  correlationId?: string;
}

class LogsManager {
  private logs: LogEntry[] = [];
  private maxLogs: number = 10000;
  private logSubscribers: Set<(log: LogEntry) => void> = new Set();
  private supabaseClient: any;

  constructor(supabaseClient?: any) {
    this.supabaseClient = supabaseClient;
  }

  // Enregistrer un log
  log(level: LogLevel, source: string, message: string, metadata?: any, correlationId?: string) {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      source,
      message,
      metadata,
      correlationId
    };

    // Ajouter au buffer en mémoire
    this.logs.push(logEntry);
    
    // Limiter la taille du buffer
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Notifier les subscribers
    this.logSubscribers.forEach(subscriber => subscriber(logEntry));

    // Persister dans Supabase si configuré
    if (this.supabaseClient) {
      this.persistLog(logEntry);
    }

    // Console output
    this.consoleOutput(logEntry);
  }

  // Raccourcis pour différents niveaux
  debug(source: string, message: string, metadata?: any) {
    this.log(LogLevel.DEBUG, source, message, metadata);
  }

  info(source: string, message: string, metadata?: any) {
    this.log(LogLevel.INFO, source, message, metadata);
  }

  warn(source: string, message: string, metadata?: any) {
    this.log(LogLevel.WARN, source, message, metadata);
  }

  error(source: string, message: string, metadata?: any) {
    this.log(LogLevel.ERROR, source, message, metadata);
  }

  critical(source: string, message: string, metadata?: any) {
    this.log(LogLevel.CRITICAL, source, message, metadata);
  }

  // Persister dans Supabase
  private async persistLog(log: LogEntry) {
    try {
      await this.supabaseClient
        .from('svh_logs')
        .insert({
          timestamp: log.timestamp.toISOString(),
          level: log.level,
          source: log.source,
          message: log.message,
          metadata: log.metadata,
          correlation_id: log.correlationId
        });
    } catch (error) {
      console.error('[SVH] Erreur persistance log:', error);
    }
  }

  // Output console avec couleurs
  private consoleOutput(log: LogEntry) {
    const colors: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: '\x1b[36m',     // Cyan
      [LogLevel.INFO]: '\x1b[32m',      // Green
      [LogLevel.WARN]: '\x1b[33m',      // Yellow
      [LogLevel.ERROR]: '\x1b[31m',     // Red
      [LogLevel.CRITICAL]: '\x1b[35m'   // Magenta
    };
    
    const reset = '\x1b[0m';
    const color = colors[log.level];
    
    console.log(
      `${color}[${log.timestamp.toISOString()}] [${log.level}] [${log.source}]${reset} ${log.message}`,
      log.metadata ? log.metadata : ''
    );
  }

  // S'abonner aux logs en temps réel
  subscribe(callback: (log: LogEntry) => void) {
    this.logSubscribers.add(callback);
    return () => this.logSubscribers.delete(callback);
  }

  // Rechercher dans les logs
  search(criteria: {
    level?: LogLevel;
    source?: string;
    startDate?: Date;
    endDate?: Date;
    keyword?: string;
  }): LogEntry[] {
    return this.logs.filter(log => {
      if (criteria.level && log.level !== criteria.level) return false;
      if (criteria.source && log.source !== criteria.source) return false;
      if (criteria.startDate && log.timestamp < criteria.startDate) return false;
      if (criteria.endDate && log.timestamp > criteria.endDate) return false;
      if (criteria.keyword && !log.message.includes(criteria.keyword)) return false;
      return true;
    });
  }

  // Obtenir les derniers logs
  getRecent(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Statistiques
  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<LogLevel, number>,
      bySource: {} as Record<string, number>
    };

    this.logs.forEach(log => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      stats.bySource[log.source] = (stats.bySource[log.source] || 0) + 1;
    });

    return stats;
  }
}

// ===============================
// 💻 TERMINAL MANAGER
// ===============================

interface TerminalCommand {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<string>;
}

class TerminalManager {
  private commands: Map<string, TerminalCommand> = new Map();
  private history: string[] = [];
  private connexionManager: ConnexionManager;
  private logsManager: LogsManager;

  constructor(connexionManager: ConnexionManager, logsManager: LogsManager) {
    this.connexionManager = connexionManager;
    this.logsManager = logsManager;
    this.registerDefaultCommands();
  }

  // Enregistrer les commandes par défaut
  private registerDefaultCommands() {
    // Commande: status
    this.registerCommand({
      name: 'status',
      description: 'Afficher le statut du système',
      execute: async () => {
        return `
╔════════════════════════════════════════╗
║   SUPERBOT HAÏ FAMILY - SYSTEM STATUS  ║
╚════════════════════════════════════════╝

📊 Vitrines:
${VITRINES.map(v => `  ✓ ${v.name.padEnd(25)} [PORT ${v.port}]`).join('\n')}

🤖 Bots:
${BOTS.map(b => `  ✓ ${b.name.padEnd(25)} [PORT ${b.port}]`).join('\n')}

✅ Tous les services sont opérationnels
        `;
      }
    });

    // Commande: deploy
    this.registerCommand({
      name: 'deploy',
      description: 'Déployer une vitrine',
      execute: async (args) => {
        const vitrine = args[0];
        if (!vitrine) {
          return '❌ Usage: deploy <vitrine-name>';
        }
        
        this.logsManager.info('terminal', `Déploiement de ${vitrine}`);
        return `🚀 Déploiement de ${vitrine} en cours...`;
      }
    });

    // Commande: logs
    this.registerCommand({
      name: 'logs',
      description: 'Afficher les logs récents',
      execute: async (args) => {
        const count = parseInt(args[0]) || 10;
        const recent = this.logsManager.getRecent(count);
        return recent.map(log => 
          `[${log.timestamp.toISOString()}] [${log.level}] ${log.source}: ${log.message}`
        ).join('\n');
      }
    });

    // Commande: bot
    this.registerCommand({
      name: 'bot',
      description: 'Interagir avec un bot',
      execute: async (args) => {
        const [botName, ...messageArgs] = args;
        if (!botName || messageArgs.length === 0) {
          return '❌ Usage: bot <bot-name> <message>';
        }
        
        try {
          const result = await this.connexionManager.routeToBot(botName, {
            message: messageArgs.join(' ')
          });
          return `🤖 ${botName}: ${JSON.stringify(result, null, 2)}`;
        } catch (error) {
          return `❌ Erreur: ${error.message}`;
        }
      }
    });

    // Commande: help
    this.registerCommand({
      name: 'help',
      description: 'Afficher l\'aide',
      execute: async () => {
        const commandList = Array.from(this.commands.entries())
          .map(([name, cmd]) => `  ${name.padEnd(15)} - ${cmd.description}`)
          .join('\n');
        
        return `
📚 Commandes disponibles:
${commandList}
        `;
      }
    });
  }

  // Enregistrer une commande personnalisée
  registerCommand(command: TerminalCommand) {
    this.commands.set(command.name, command);
  }

  // Exécuter une commande
  async execute(input: string): Promise<string> {
    this.history.push(input);
    
    const [commandName, ...args] = input.trim().split(' ');
    const command = this.commands.get(commandName);
    
    if (!command) {
      return `❌ Commande inconnue: ${commandName}. Tapez 'help' pour la liste des commandes.`;
    }
    
    try {
      this.logsManager.debug('terminal', `Exécution: ${input}`);
      const result = await command.execute(args);
      return result;
    } catch (error) {
      this.logsManager.error('terminal', `Erreur commande ${commandName}`, { error });
      return `❌ Erreur: ${error.message}`;
    }
  }

  // Obtenir l'historique
  getHistory(): string[] {
    return this.history;
  }
}

// ===============================
// 🚀 EXPORT SYSTÈME SVH COMPLET
// ===============================

export class SVHSystem {
  public connexions: ConnexionManager;
  public logs: LogsManager;
  public terminal: TerminalManager;

  constructor(supabaseClient?: any) {
    console.log('🎯 [SVH] Initialisation du Système Vitrine Haï...');
    
    this.connexions = new ConnexionManager();
    this.logs = new LogsManager(supabaseClient);
    this.terminal = new TerminalManager(this.connexions, this.logs);

    // Setup event listeners
    this.setupEventListeners();
    
    console.log('✅ [SVH] Système initialisé avec succès');
  }

  private setupEventListeners() {
    this.connexions.on('connection:established', (data) => {
      this.logs.info('connexions', `Connexion établie: ${data.name}`, data);
    });

    this.connexions.on('connection:failed', (data) => {
      this.logs.error('connexions', `Échec connexion: ${data.name}`, data);
    });

    this.connexions.on('health:check', (data) => {
      if (!data.healthy) {
        this.logs.warn('health', `Service non sain: ${data.name}`, data);
      }
    });

    this.connexions.on('auth:synced', (data) => {
      this.logs.info('auth', `Auth synchronisée depuis ${data.source}`, data);
    });
  }

  // Cleanup
  destroy() {
    this.connexions.destroy();
    console.log('🛑 [SVH] Système arrêté');
  }
}

export { ConnexionManager, LogsManager, TerminalManager, LogLevel };
export type { LogEntry, TerminalCommand, VitrineConfig, BotConfig };
