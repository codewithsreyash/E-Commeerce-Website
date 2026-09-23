package com.shopping.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.shopping.dto.AuthRequest;
import com.shopping.dto.AuthResponse;
import com.shopping.dto.RegisterRequest;
import com.shopping.exception.DuplicateResourceException;
import com.shopping.model.User;
import com.shopping.model.UserRole;
import com.shopping.repository.UserRepository;
import com.shopping.repository.CustomerRepository;
import com.shopping.security.AuthenticatedUser;
import com.shopping.security.JwtService;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserRepository userRepository;
    @Mock private CustomerRepository customerRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private Authentication authentication;

    @InjectMocks private AuthService authService;

    @Test
    void registerCreatesUserAndReturnsJwt() {
        RegisterRequest request = new RegisterRequest("manager1", "Password@123", UserRole.CUSTOMER);
        when(userRepository.findByUsername("manager1")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("Password@123")).thenReturn("encoded-password");
        when(jwtService.generateToken("manager1", "CUSTOMER")).thenReturn("jwt-token");
        when(customerRepository.findAll(any(), any())).thenReturn(java.util.List.of());

        AuthResponse response = authService.register(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getUsername()).isEqualTo("manager1");
        assertThat(captor.getValue().getPasswordHash()).isEqualTo("encoded-password");
        assertThat(captor.getValue().getRole()).isEqualTo("CUSTOMER");
        verify(customerRepository).save(any());
        assertThat(response.token()).isEqualTo("jwt-token");
    }

    @Test
    void registerRejectsDuplicateUser() {
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(new User()));

        assertThatThrownBy(() -> authService.register(new RegisterRequest("admin", "Password@123", UserRole.CUSTOMER)))
            .isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    void publicRegistrationRejectsPrivilegedRoles() {
        for (UserRole role : new UserRole[] {UserRole.ADMIN, UserRole.MANAGER}) {
            assertThatThrownBy(() -> authService.register(new RegisterRequest("attacker", "Password@123", role)))
                .isInstanceOf(org.springframework.security.access.AccessDeniedException.class);
        }
        org.mockito.Mockito.verifyNoInteractions(userRepository, customerRepository, jwtService);
    }

    @Test
    void loginAuthenticatesAndBuildsResponse() {
        AuthenticatedUser principal = new AuthenticatedUser("admin", "hash", "ADMIN");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(principal);
        when(jwtService.generateToken("admin", "ADMIN")).thenReturn("jwt-token");

        AuthResponse response = authService.login(new AuthRequest("admin", "Admin@123"));

        assertThat(response.username()).isEqualTo("admin");
        assertThat(response.role()).isEqualTo("ADMIN");
        assertThat(response.token()).isEqualTo("jwt-token");
    }
}
