import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Frontend from './Frontend';
import Auth from './Auth';
import { useAuthContext } from 'contexts/AuthContext';
import PrivateRoute from 'components/PrivateRoute';

export default function Index() {
  const { isAuth } = useAuthContext();
  return (
    <>
      <Routes>
        <Route path="/*" element={<PrivateRoute Component={Frontend} />} />
        <Route
          path="/auth/*"
          element={!isAuth ? <Auth /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}
