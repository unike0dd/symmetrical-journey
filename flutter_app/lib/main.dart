import 'package:flutter/material.dart';
import 'package:flutter_app/models/user_model.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  // For demonstration purposes, we will have a hardcoded user.
  // In a real app, you would have a login system to get the current user.
  User? _currentUser;

  @override
  void initState() {
    super.initState();
    // For now, the user is a guest.
    _currentUser = User(
      id: 'guest',
      email: '',
      displayName: 'Guest',
      role: UserRole.guest,
    );
  }

  void _login(UserRole role) {
    setState(() {
      if (role == UserRole.admin) {
        _currentUser = User(
          id: 'admin-user-id',
          email: 'admin@example.com',
          displayName: 'Admin User',
          role: UserRole.admin,
        );
      } else {
        _currentUser = User(
          id: 'consumer-user-id',
          email: 'consumer@example.com',
          displayName: 'Consumer User',
          role: UserRole.endConsumer,
        );
      }
    });
  }

  void _logout() {
    setState(() {
      _currentUser = User(
        id: 'guest',
        email: '',
        displayName: 'Guest',
        role: UserRole.guest,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Symmetrical Journey',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: _currentUser!.role == UserRole.guest
          ? LoginPage(
              onLogin: _login,
            )
          : _currentUser!.role == UserRole.admin
              ? AdminHomePage(
                  onLogout: _logout,
                )
              : ConsumerHomePage(
                  onLogout: _logout,
                ),
    );
  }
}

class LoginPage extends StatelessWidget {
  final void Function(UserRole) onLogin;

  const LoginPage({super.key, required this.onLogin});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () => onLogin(UserRole.admin),
              child: const Text('Login as Admin'),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => onLogin(UserRole.endConsumer),
              child: const Text('Login as Consumer'),
            ),
          ],
        ),
      ),
    );
  }
}

class AdminHomePage extends StatelessWidget {
  final VoidCallback onLogout;

  const AdminHomePage({super.key, required this.onLogout});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Home'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: onLogout,
          ),
        ],
      ),
      body: const Center(
        child: Text('Welcome, Admin!'),
      ),
    );
  }
}

class ConsumerHomePage extends StatelessWidget {
  final VoidCallback onLogout;

  const ConsumerHomePage({super.key, required this.onLogout});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: onLogout,
          ),
        ],
      ),
      body: const Center(
        child: Text('Welcome, Consumer!'),
      ),
    );
  }
}