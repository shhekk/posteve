import React, { useEffect, useState } from 'react';
import { CreateUserDto } from '@posteve/nestjs-libraries/dtos/user.dto';
import { Button } from '@mui/material';
import { LabelAndInput } from '@client/lib/components/LabelInput';
import { validateDto } from '@posteve/utils/fetch/validateDTO';
import { customFetch } from '@posteve/utils/fetch/customFetch';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export function Signup(): React.JSX.Element {
  const [formData, setFormData] = useState<CreateUserDto>({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string[] | null>();
  const n = useNavigate();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { err } = await validateDto({
        dto: CreateUserDto,
        data: formData,
      });
      setError(err);

      if (err) {
        //@todo add toast
        console.log('validation err', err);
        return;
      }

      setLoading(true);
      const res = await customFetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: formData,
      });
      setLoading(false);
      if (res.data) {
        //@todo toast => Email sent, verify your email
        console.log(
          'user signedup successfully, check email to verify',
          res.data
        );
        return;
      }
      console.log('a erorrororororo hogyaaaaaaa', { res });
      return;
    } catch (err) {
      //@todo toast => Server down
      setLoading(false);
      setError(['Something Went Wrong!!!']);
      console.warn({ msg: 'signup failed', err });
    }
  };

  return (
    <form
      style={{
        width: 'full',
        marginTop: '0.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <LabelAndInput
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleOnChange}
        />

        <LabelAndInput
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleOnChange}
        />

        <LabelAndInput
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleOnChange}
          type="password"
        />

        <Button
          type="submit"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          Signup
        </Button>
        <Link to={'/auth/signin'}>Already have an account? Signin</Link>
        {error &&
          error.map((e, i) => (
            <div>
              <b>{i + 1} </b>
              {e}
            </div>
          ))}
      </div>
    </form>
  );
}
