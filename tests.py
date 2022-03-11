from unittest import TestCase
from flask import session
from model import (app, connect_to_db, db, example_data)


class PupJourneyTests(TestCase):
    """Flask tests."""

    def setUp(self):
        """Stuff to do before every test."""

        # Get the Flask test client
        self.client = app.test_client()

        # Show Flask errors that happen during tests
        app.config['TESTING'] = True

    def test_index(self):
        """Test homepage page."""

        result = self.client.get("/")
        self.assertIn(b"Welcome!", result.data)

    def test_login(self):
        """Test login page."""

        result = self.client.post("/login",
                                  data={"email": "test@test", "current-password": "test"},
                                  follow_redirects=True)
        self.assertIn(b"Welcome back", result.data)


class FlaskTestsDatabase(TestCase):
    """Flask tests that use the database."""

    def setUp(self):
        """Stuff to do before every test."""

        # Get the Flask test client
        self.client = app.test_client()
        app.config['TESTING'] = True

        # Connect to test database
        connect_to_db(app, "postgresql:///testdb")

        # Create tables and add sample data
        db.create_all()
        example_data()

    def tearDown(self):
        """Do at end of every test."""

        db.session.remove()
        db.drop_all()
        db.engine.dispose()

    def test_dashboard_pets(self):
        """Test dashboard page."""

        result = self.client.get("/dashboard")
        self.assertIn(b"Test Pet 1", result.data)

    def test_dashboard_check_ins(self):
        """Test dashboard page."""

        result = self.client.get("/dashboard")
        self.assertIn(b"Cedar Grove and Vista View Point in Griffith Park", result.data)


class FlaskTestsLoggedIn(TestCase):
    """Flask tests with user logged in to session."""

    def setUp(self):
        """Stuff to do before every test."""

        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'key'
        self.client = app.test_client()

        with self.client as c:
            with c.session_transaction() as sess:
                sess['user_id'] = 1

    def test_dashboard_page(self):
        """Test dashboard page."""

        result = self.client.get("/dashboard")
        self.assertIn(b"Where We've Been", result.data)


class FlaskTestsLoggedOut(TestCase):
    """Flask tests with user logged in to session."""

    def setUp(self):
        """Stuff to do before every test."""

        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_dashboard_page(self):
        """Test that user can't see dashboard page when logged out."""

        result = self.client.get("/dashboard", follow_redirects=True)
        self.assertNotIn(b"Where We've Been", result.data)
        self.assertIn(b"You must log in to view your dashboard.", result.data)


class FlaskTestsLogInLogOut(TestCase):  # Bonus example. Not in lecture.
    """Test log in and log out."""

    def setUp(self):
        """Before every test"""

        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_login(self):
        """Test log in form.

        Unlike login test above, 'with' is necessary here in order to refer to session.
        """

        with self.client as c:
            result = c.post('/login',
                            data={"email": "test@test", 'current-password': 'test'},
                            follow_redirects=True
                            )
            self.assertEqual(session['user_email'], 'test@test')
            self.assertIn(b"Welcome back", result.data)

    def test_logout(self):
        """Test logout route."""

        with self.client as c:
            with c.session_transaction() as sess:
                sess['user_email'] = 'test@test'

            result = self.client.get('/logout', follow_redirects=True)

            self.assertNotIn(b'user_email', session)
            self.assertIn(b'Successfully logged out!', result.data)


if __name__ == "__main__":
    import unittest

    unittest.main()
