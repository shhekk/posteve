import { LabelAndInput } from '@client/lib/components/LabelInput';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { customFetch } from '@posteve/utils/fetch/customFetch';
import { loginUserDto } from '@posteve/nestjs-libraries/dtos/user.dto';
import { validateDto } from '@posteve/utils/fetch/validateDTO';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUserStore } from '@client/lib/store/user';

export function Signin() {
  console.log('signin redereed...');
  const [formData, setFormData] = useState<loginUserDto>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[] | null>();
  const n = useNavigate();
  const { setUserId } = useUserStore();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { err } = await validateDto({ dto: loginUserDto, data: formData });
      setErrors(err);
      if (err) {
        return;
      }
      setLoading(true);
      const res = await customFetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: formData,
      });
      if (!res.data) {
        setLoading(false);
        throw 'not found';
      }
      await setUserId();

      console.log('user signed in successfully, ', { data: res.data });

      setTimeout(() => {
        alert('redirecting user to posteve...');
        n('/'); //don't do redirecting in authentication pages app will itself take care of it
      }, 1500);
      return;
    } catch (error) {
      console.log('signin err;;;;;,', { error });
      setErrors([typeof error === 'string' ? error : 'Something Went Wrong']);
      setLoading(false);
      return;
    }
  };

  return (
    <form
      style={{
        width: 'full',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <LabelAndInput
          label="email"
          value={formData.email}
          onChange={handleChange}
        />
        <LabelAndInput
          label="password"
          value={formData.password}
          type="password"
          onChange={handleChange}
        />

        <Button
          type="submit"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          disabled={loading}
        >
          Login
        </Button>
        <Link to={'/auth/signup'}>Create New Account</Link>
        {errors &&
          errors.map((e, i) => (
            //@todo put toast here
            <div key={i}>
              <li>
                <b>{i + 1}</b> {e}
              </li>
            </div>
          ))}
      </div>
    </form>
  );
}
