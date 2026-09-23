package com.shopping.service;

import com.shopping.dto.AuthRequest;
import com.shopping.dto.AuthResponse;
import com.shopping.dto.RegisterRequest;
import com.shopping.exception.DuplicateResourceException;
import com.shopping.exception.UnauthorizedException;
import com.shopping.model.Customer;
import com.shopping.model.User;
import com.shopping.model.UserRole;
import com.shopping.repository.CustomerRepository;
import com.shopping.repository.UserRepository;
import com.shopping.security.AuthenticatedUser;
import com.shopping.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
        AuthenticationManager authenticationManager,
        UserRepository userRepository,
        CustomerRepository customerRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (request.role() != UserRole.CUSTOMER) {
            throw new org.springframework.security.access.AccessDeniedException("Public registration is limited to customers");
        }
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new DuplicateResourceException("Username already exists");
        }
        User user = new User();
        user.setUsername(request.username());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(request.role().name());
        userRepository.save(user);

        // Auto-create a customers row for CUSTOMER role so orders can be linked
        if (request.role() == UserRole.CUSTOMER) {
            boolean alreadyExists = !customerRepository.findAll(
                org.springframework.data.domain.PageRequest.of(0, 1), request.username()
            ).isEmpty();
            if (!alreadyExists) {
                Customer customer = new Customer();
                // Derive first/last name from username (use email prefix)
                String namePart = request.username().contains("@")
                    ? request.username().split("@")[0] : request.username();
                customer.setFirstName(namePart);
                customer.setLastName("(registered)");
                customer.setEmail(request.username());
                customer.setPasswordHash(passwordEncoder.encode(request.password()));
                customer.setPhone("");
                customer.setAddress("");
                customerRepository.save(customer);
            }
        }

        return buildResponse(user.getUsername(), user.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
            AuthenticatedUser principal = (AuthenticatedUser) authentication.getPrincipal();
            return buildResponse(principal.getUsername(), principal.getRole());
        } catch (Exception ex) {
            throw new UnauthorizedException("Invalid username or password");
        }
    }

    private AuthResponse buildResponse(String username, String role) {
        String token = jwtService.generateToken(username, role);
        return new AuthResponse(token, "Bearer", username, role);
    }
}
