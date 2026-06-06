import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/dashboard_provider.dart';
import 'providers/pc_provider.dart';
import 'providers/session_provider.dart';
import 'providers/reservation_provider.dart';
import 'providers/tournament_provider.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ArenaDeskApp());
}

class ArenaDeskApp extends StatelessWidget {
  const ArenaDeskApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProxyProvider<AuthProvider, DashboardProvider>(
          create: (_) => DashboardProvider(),
          update: (_, auth, dashboard) => dashboard!..updateAuth(auth),
        ),
        ChangeNotifierProxyProvider<AuthProvider, PCProvider>(
          create: (_) => PCProvider(),
          update: (_, auth, pc) => pc!..updateAuth(auth),
        ),
        ChangeNotifierProxyProvider<AuthProvider, SessionProvider>(
          create: (_) => SessionProvider(),
          update: (_, auth, session) => session!..updateAuth(auth),
        ),
        ChangeNotifierProxyProvider<AuthProvider, ReservationProvider>(
          create: (_) => ReservationProvider(),
          update: (_, auth, res) => res!..updateAuth(auth),
        ),
        ChangeNotifierProxyProvider<AuthProvider, TournamentProvider>(
          create: (_) => TournamentProvider(),
          update: (_, auth, tour) => tour!..updateAuth(auth),
        ),
      ],
      child: MaterialApp(
        title: 'ArenaDesk OS',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        home: const AuthGate(),
      ),
    );
  }
}

class AuthGate extends StatefulWidget {
  const AuthGate({super.key});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AuthProvider>().checkAuth();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        if (auth.isLoading) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(color: AppTheme.primary),
            ),
          );
        }
        if (auth.isAuthenticated) {
          return const DashboardScreen();
        }
        return const LoginScreen();
      },
    );
  }
}
