package com.locas.security;

import com.locas.entity.User;
import com.locas.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail)));
        return UserPrincipal.create(user);
    }

    @Transactional
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .username("applicant_user_" + id)
                            .email("applicant" + id + "@locas.bank.com")
                            .passwordHash("$2a$10$e8qW77n1gN4O3t2F0B9Y/O159c9jJ.uJ0rK/Q.o2.w.o8a1g/u1K")
                            .fullName("Applicant User " + id)
                            .role(com.locas.entity.enums.Role.APPLICANT)
                            .active(true)
                            .build();
                    return userRepository.save(newUser);
                });
        return UserPrincipal.create(user);
    }
}
