# Tasks 77-83: Serializers, ViewSet, Reports

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** F - Payment API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 77, 78, 79, 80, 81, 82, 83

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group E: Payment Receipts & Notifications](../Group-E_Payment-Receipts-Notifications/)
- **→ Next Document:** [02_Tasks-84-86_URLs-Tests-Documentation.md](02_Tasks-84-86_URLs-Tests-Documentation.md)

---

## Document Overview

This document implements REST API for payment operations, including serializers for payments and refunds, ViewSets with CRUD operations, custom actions for payment recording, filtering capabilities, and reporting endpoints.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 77 | Create PaymentSerializer | Medium | 25 min |
| 78 | Create RefundSerializer | Medium | 25 min |
| 79 | Create PaymentListSerializer | Low | 20 min |
| 80 | Create PaymentViewSet | High | 30 min |
| 81 | Implement Payment Filtering | Medium | 25 min |
| 82 | Add Payment Actions | High | 30 min |
| 83 | Create Payment Reports Endpoint | Medium | 30 min |

---

## Task 77: Create PaymentSerializer

### Overview
Create DRF serializers for Payment model with nested relationships, method details handling, and validation.

### Dependencies
- Payment model exists
- DRF installed

### Instructions

1. **Create PaymentSerializer**
   - All Payment model fields
   - Nested customer/invoice/order representations
   - method_details handling (JSONField)
   - Read-only computed fields

2. **Add validation**
   - Amount validation (positive)
   - Method validation
   - Status validation
   - Currency validation

3. **Add custom fields**
   - customer_name (read-only)
   - invoice_number (read-only)
   - payment_method_display (read-only)
   - has_receipt (read-only)

### Implementation

```python
# Create apps/payments/serializers/__init__.py

from .payment_serializer import (
    PaymentSerializer,
    PaymentDetailSerializer,
    PaymentListSerializer,
    PaymentCreateSerializer
)
from .refund_serializer import (
    RefundSerializer,
    RefundCreateSerializer,
    RefundListSerializer
)

__all__ = [
    'PaymentSerializer',
    'PaymentDetailSerializer',
    'PaymentListSerializer',
    'PaymentCreateSerializer',
    'RefundSerializer',
    'RefundCreateSerializer',
    'RefundListSerializer',
]
```

```python
# Create apps/payments/serializers/payment_serializer.py

from rest_framework import serializers
from decimal import Decimal

from apps.payments.models import Payment, PaymentAllocation
from apps.customers.serializers import CustomerListSerializer
from apps.invoices.serializers import InvoiceListSerializer


class PaymentAllocationSerializer(serializers.ModelSerializer):
    """Serializer for payment allocations"""
    
    invoice_number = serializers.CharField(source='invoice.invoice_number', read_only=True)
    
    class Meta:
        model = PaymentAllocation
        fields = [
            'id',
            'invoice',
            'invoice_number',
            'allocated_amount',
            'allocated_at',
        ]
        read_only_fields = ['id', 'allocated_at']


class PaymentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for payment lists"""
    
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    invoice_number = serializers.CharField(source='invoice.invoice_number', read_only=True)
    payment_method_display = serializers.CharField(source='get_method_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_status_display', read_only=True)
    has_receipt = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = [
            'id',
            'payment_number',
            'customer',
            'customer_name',
            'invoice',
            'invoice_number',
            'method',
            'payment_method_display',
            'status',
            'payment_status_display',
            'amount',
            'currency',
            'payment_date',
            'has_receipt',
            'created_at',
        ]
        read_only_fields = ['id', 'payment_number', 'created_at']
    
    def get_has_receipt(self, obj):
        """Check if payment has receipt"""
        return hasattr(obj, 'receipt')


class PaymentSerializer(serializers.ModelSerializer):
    """Full serializer for Payment model"""
    
    # Read-only nested representations
    customer_details = CustomerListSerializer(source='customer', read_only=True)
    invoice_details = InvoiceListSerializer(source='invoice', read_only=True)
    
    # Display fields
    payment_method_display = serializers.CharField(source='get_method_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    # Computed fields
    has_receipt = serializers.SerializerMethodField()
    receipt_number = serializers.SerializerMethodField()
    total_refunded = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    refund_status = serializers.CharField(read_only=True)
    
    # Allocations
    allocations = PaymentAllocationSerializer(many=True, read_only=True)
    
    # User info
    received_by_name = serializers.CharField(source='received_by.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id',
            'payment_number',
            'tenant',
            
            # References
            'customer',
            'customer_details',
            'invoice',
            'invoice_details',
            'order',
            
            # Payment details
            'method',
            'payment_method_display',
            'status',
            'payment_status_display',
            'amount',
            'currency',
            'exchange_rate',
            'payment_date',
            'processed_at',
            'cancelled_at',
            
            # Method-specific details
            'method_details',
            'reference_number',
            
            # Users
            'received_by',
            'received_by_name',
            'approved_by',
            'approved_by_name',
            
            # Notes
            'notes',
            'internal_notes',
            
            # Refunds
            'total_refunded',
            'refund_status',
            
            # Receipt
            'has_receipt',
            'receipt_number',
            
            # Allocations
            'allocations',
            
            # Timestamps
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'payment_number',
            'tenant',
            'total_refunded',
            'refund_status',
            'processed_at',
            'cancelled_at',
            'created_at',
            'updated_at',
        ]
    
    def get_has_receipt(self, obj):
        """Check if payment has receipt"""
        return hasattr(obj, 'receipt')
    
    def get_receipt_number(self, obj):
        """Get receipt number if exists"""
        if hasattr(obj, 'receipt'):
            return obj.receipt.receipt_number
        return None
    
    def validate_amount(self, value):
        """Validate payment amount"""
        if value <= 0:
            raise serializers.ValidationError('Payment amount must be greater than 0')
        
        if value > Decimal('9999999999.99'):
            raise serializers.ValidationError('Payment amount is too large')
        
        return value
    
    def validate_method_details(self, value):
        """Validate method_details JSONField"""
        if not isinstance(value, dict):
            raise serializers.ValidationError('method_details must be a JSON object')
        
        return value
    
    def validate(self, attrs):
        """Cross-field validation"""
        method = attrs.get('method')
        method_details = attrs.get('method_details', {})
        
        # Validate card payments have required details
        if method == 'CARD':
            required_fields = ['card_type', 'last_4_digits']
            for field in required_fields:
                if field not in method_details:
                    raise serializers.ValidationError({
                        'method_details': f'Card payments require {field} in method_details'
                    })
        
        # Validate bank transfers have bank_name
        elif method == 'BANK_TRANSFER':
            if 'bank_name' not in method_details:
                raise serializers.ValidationError({
                    'method_details': 'Bank transfers require bank_name in method_details'
                })
        
        # Validate mobile payments have provider and mobile_number
        elif method == 'MOBILE':
            required_fields = ['provider', 'mobile_number']
            for field in required_fields:
                if field not in method_details:
                    raise serializers.ValidationError({
                        'method_details': f'Mobile payments require {field} in method_details'
                    })
        
        return attrs


class PaymentDetailSerializer(PaymentSerializer):
    """Detailed serializer with additional related data"""
    
    # Payment history
    history = serializers.SerializerMethodField()
    
    # Refunds
    refunds = serializers.SerializerMethodField()
    
    class Meta(PaymentSerializer.Meta):
        fields = PaymentSerializer.Meta.fields + ['history', 'refunds']
    
    def get_history(self, obj):
        """Get payment history"""
        from apps.payments.serializers.payment_history_serializer import PaymentHistorySerializer
        history = obj.history.all().order_by('-created_at')[:10]
        return PaymentHistorySerializer(history, many=True).data
    
    def get_refunds(self, obj):
        """Get related refunds"""
        from apps.payments.serializers.refund_serializer import RefundListSerializer
        refunds = obj.refunds.all()
        return RefundListSerializer(refunds, many=True).data


class PaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payments (used by ViewSet)"""
    
    class Meta:
        model = Payment
        fields = [
            'customer',
            'invoice',
            'order',
            'method',
            'amount',
            'currency',
            'payment_date',
            'method_details',
            'reference_number',
            'notes',
            'received_by',
        ]
    
    def validate(self, attrs):
        """Validate payment creation"""
        # At least one of invoice or order must be provided
        if not attrs.get('invoice') and not attrs.get('order'):
            raise serializers.ValidationError(
                'Either invoice or order must be provided'
            )
        
        # Validate amount against invoice/order
        invoice = attrs.get('invoice')
        if invoice:
            outstanding = invoice.total_amount - (invoice.paid_amount or Decimal('0'))
            if attrs['amount'] > outstanding:
                raise serializers.ValidationError({
                    'amount': f'Payment amount exceeds outstanding balance ({outstanding})'
                })
        
        return attrs
    
    def create(self, validated_data):
        """Create payment using PaymentService"""
        from apps.payments.services.payment_service import PaymentService
        
        # Extract method and prepare data
        method = validated_data['method']
        
        # Map to service method
        if method == 'CASH':
            result = PaymentService.record_cash_payment(validated_data)
        elif method == 'CARD':
            result = PaymentService.record_card_payment(validated_data)
        elif method == 'BANK_TRANSFER':
            result = PaymentService.record_bank_transfer(validated_data)
        elif method == 'MOBILE':
            result = PaymentService.record_mobile_payment(validated_data)
        elif method == 'CHECK':
            result = PaymentService.record_check_payment(validated_data)
        elif method == 'STORE_CREDIT':
            result = PaymentService.record_store_credit(validated_data)
        else:
            raise serializers.ValidationError({'method': 'Invalid payment method'})
        
        if not result['success']:
            raise serializers.ValidationError(result.get('error', 'Payment creation failed'))
        
        return result['payment']
```

### Expected Outcome
- PaymentSerializer with full fields
- PaymentListSerializer for lists
- PaymentDetailSerializer with related data
- PaymentCreateSerializer for creating payments
- Validation for amount and method details

### Verification Checklist
- [ ] PaymentSerializer created
- [ ] PaymentListSerializer created
- [ ] PaymentDetailSerializer created
- [ ] PaymentCreateSerializer created
- [ ] Nested representations for customer/invoice
- [ ] method_details validation
- [ ] Amount validation
- [ ] Method-specific validation (card, bank, mobile)
- [ ] has_receipt computed field
- [ ] Allocations serialization

---

## Task 78: Create RefundSerializer

### Overview
Create DRF serializers for Refund model with validation and nested representations.

### Dependencies
- Refund model exists
- PaymentSerializer exists

### Instructions

1. **Create RefundSerializer**
   - All Refund model fields
   - Nested payment representation
   - Status display fields

2. **Add validation**
   - Refund amount validation
   - Reason validation
   - Method validation

3. **Create RefundListSerializer**
   - Lightweight for lists

4. **Create RefundCreateSerializer**
   - For refund requests

### Implementation

```python
# Create apps/payments/serializers/refund_serializer.py

from rest_framework import serializers
from decimal import Decimal

from apps.payments.models import Refund
from apps.customers.serializers import CustomerListSerializer


class RefundListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for refund lists"""
    
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    payment_number = serializers.CharField(source='original_payment.payment_number', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    reason_display = serializers.CharField(source='get_reason_display', read_only=True)
    
    class Meta:
        model = Refund
        fields = [
            'id',
            'refund_number',
            'customer',
            'customer_name',
            'original_payment',
            'payment_number',
            'refund_amount',
            'currency',
            'status',
            'status_display',
            'reason',
            'reason_display',
            'requested_at',
            'approved_at',
            'completed_at',
        ]
        read_only_fields = ['id', 'refund_number', 'requested_at']


class RefundSerializer(serializers.ModelSerializer):
    """Full serializer for Refund model"""
    
    # Nested representations
    customer_details = CustomerListSerializer(source='customer', read_only=True)
    payment_details = serializers.SerializerMethodField()
    
    # Display fields
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    reason_display = serializers.CharField(source='get_reason_display', read_only=True)
    method_display = serializers.CharField(source='get_refund_method_display', read_only=True)
    
    # User info
    requested_by_name = serializers.CharField(source='requested_by.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    processed_by_name = serializers.CharField(source='processed_by.get_full_name', read_only=True)
    
    class Meta:
        model = Refund
        fields = [
            'id',
            'refund_number',
            'tenant',
            
            # References
            'customer',
            'customer_details',
            'original_payment',
            'payment_details',
            'invoice',
            
            # Refund details
            'refund_amount',
            'currency',
            'reason',
            'reason_display',
            'reason_description',
            'refund_method',
            'method_display',
            'status',
            'status_display',
            
            # Users
            'requested_by',
            'requested_by_name',
            'approved_by',
            'approved_by_name',
            'processed_by',
            'processed_by_name',
            
            # Timestamps
            'requested_at',
            'approved_at',
            'rejected_at',
            'processing_started_at',
            'completed_at',
            'failed_at',
            
            # Notes
            'approval_notes',
            'rejection_reason',
            'processing_notes',
            
            # Timestamps
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'refund_number',
            'tenant',
            'requested_at',
            'approved_at',
            'rejected_at',
            'processing_started_at',
            'completed_at',
            'failed_at',
            'created_at',
            'updated_at',
        ]
    
    def get_payment_details(self, obj):
        """Get payment details"""
        from apps.payments.serializers.payment_serializer import PaymentListSerializer
        return PaymentListSerializer(obj.original_payment).data
    
    def validate_refund_amount(self, value):
        """Validate refund amount"""
        if value <= 0:
            raise serializers.ValidationError('Refund amount must be greater than 0')
        
        return value
    
    def validate(self, attrs):
        """Cross-field validation"""
        # If original_payment provided, validate refundable amount
        if 'original_payment' in attrs:
            payment = attrs['original_payment']
            refund_amount = attrs['refund_amount']
            
            # Check if payment can be refunded
            if payment.status != 'COMPLETED':
                raise serializers.ValidationError({
                    'original_payment': 'Only completed payments can be refunded'
                })
            
            # Check remaining refundable amount
            remaining = payment.get_remaining_refundable()
            if refund_amount > remaining:
                raise serializers.ValidationError({
                    'refund_amount': f'Refund amount exceeds remaining refundable amount ({remaining})'
                })
        
        return attrs


class RefundCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating refund requests"""
    
    class Meta:
        model = Refund
        fields = [
            'original_payment',
            'refund_amount',
            'reason',
            'reason_description',
            'refund_method',
        ]
    
    def validate(self, attrs):
        """Validate refund request"""
        payment = attrs['original_payment']
        refund_amount = attrs['refund_amount']
        
        # Validate using RefundService
        from apps.payments.services.refund_service import RefundService
        
        validation = RefundService.validate_refund_request(
            payment=payment,
            refund_amount=refund_amount,
            refund_method=attrs.get('refund_method'),
            reason=attrs.get('reason')
        )
        
        if not validation['valid']:
            raise serializers.ValidationError(validation['error'])
        
        return attrs
    
    def create(self, validated_data):
        """Create refund request using RefundService"""
        from apps.payments.services.refund_service import RefundService
        
        # Get request user
        request = self.context.get('request')
        requested_by = request.user if request else None
        
        result = RefundService.request_refund(
            payment=validated_data['original_payment'],
            refund_amount=validated_data['refund_amount'],
            reason=validated_data['reason'],
            reason_description=validated_data.get('reason_description'),
            refund_method=validated_data.get('refund_method'),
            requested_by=requested_by
        )
        
        if not result['success']:
            raise serializers.ValidationError(result.get('error', 'Refund request failed'))
        
        return result['refund']


class RefundApproveSerializer(serializers.Serializer):
    """Serializer for approving refund"""
    
    approval_notes = serializers.CharField(required=False, allow_blank=True)


class RefundRejectSerializer(serializers.Serializer):
    """Serializer for rejecting refund"""
    
    rejection_reason = serializers.CharField(required=True)
```

### Expected Outcome
- RefundSerializer with full fields
- RefundListSerializer for lists
- RefundCreateSerializer for requests
- Validation for refund amount and eligibility

### Verification Checklist
- [ ] RefundSerializer created
- [ ] RefundListSerializer created
- [ ] RefundCreateSerializer created
- [ ] RefundApproveSerializer created
- [ ] RefundRejectSerializer created
- [ ] Nested payment representation
- [ ] Refund amount validation
- [ ] Refundable amount checking
- [ ] Status validation

---

## Task 79: Create PaymentListSerializer

### Overview
This was already completed in Task 77 as part of the payment serializers. PaymentListSerializer provides lightweight serialization for payment lists with essential fields only.

### Expected Outcome
- PaymentListSerializer with essential fields
- customer_name computed field
- invoice_number computed field
- has_receipt computed field

### Verification Checklist
- [x] PaymentListSerializer exists (from Task 77)
- [x] Essential fields only
- [x] Display fields included
- [x] Efficient for large lists

---

## Task 80: Create PaymentViewSet

### Overview
Create DRF ViewSet for Payment model with CRUD operations, custom actions, and permissions.

### Dependencies
- PaymentSerializer exists
- DRF installed

### Instructions

1. **Create PaymentViewSet**
   - CRUD operations (list, create, retrieve, destroy)
   - Custom queryset with select_related/prefetch_related
   - Permission classes

2. **Override methods**
   - get_queryset(): Tenant filtering
   - get_serializer_class(): Different serializers for different actions
   - perform_create(): Use PaymentService
   - perform_destroy(): Soft delete or validation

3. **Add pagination**
   - Page size configuration

4. **Add ordering**
   - Default ordering by payment_date desc

### Implementation

```python
# Create apps/payments/views/__init__.py

from .payment_viewset import PaymentViewSet
from .refund_viewset import RefundViewSet
from .payment_plan_viewset import PaymentPlanViewSet
from .report_views import PaymentReportView

__all__ = [
    'PaymentViewSet',
    'RefundViewSet',
    'PaymentPlanViewSet',
    'PaymentReportView',
]
```

```python
# Create apps/payments/views/payment_viewset.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Prefetch
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from apps.payments.models import Payment, PaymentAllocation
from apps.payments.serializers import (
    PaymentSerializer,
    PaymentListSerializer,
    PaymentDetailSerializer,
    PaymentCreateSerializer
)
from apps.payments.filters import PaymentFilter
from apps.core.permissions import IsTenantUser


class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Payment operations
    
    Actions:
    - list: Get all payments
    - create: Create new payment (uses PaymentService)
    - retrieve: Get payment details
    - destroy: Delete payment (pending only)
    - complete: Mark payment as completed
    - cancel: Cancel payment
    - receipt: Download receipt PDF
    """
    
    permission_classes = [IsAuthenticated, IsTenantUser]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = PaymentFilter
    ordering_fields = ['payment_date', 'amount', 'created_at']
    ordering = ['-payment_date', '-created_at']
    search_fields = ['payment_number', 'reference_number', 'customer__name']
    
    def get_queryset(self):
        """Get payments for current tenant"""
        user = self.request.user
        
        # Base queryset with optimizations
        queryset = Payment.objects.filter(
            tenant=user.tenant
        ).select_related(
            'customer',
            'invoice',
            'order',
            'received_by',
            'approved_by'
        ).prefetch_related(
            Prefetch(
                'allocations',
                queryset=PaymentAllocation.objects.select_related('invoice')
            )
        )
        
        return queryset
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return PaymentListSerializer
        elif self.action == 'retrieve':
            return PaymentDetailSerializer
        elif self.action == 'create':
            return PaymentCreateSerializer
        else:
            return PaymentSerializer
    
    def perform_destroy(self, instance):
        """Only allow deletion of pending payments"""
        if instance.status != 'PENDING':
            raise serializers.ValidationError(
                'Only pending payments can be deleted'
            )
        
        instance.delete()
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark payment as completed"""
        payment = self.get_object()
        
        if payment.status != 'PENDING':
            return Response(
                {'error': 'Only pending payments can be completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update payment
        from apps.payments.services.payment_service import PaymentService
        result = PaymentService.update_payment_status(
            payment=payment,
            new_status='COMPLETED',
            user=request.user
        )
        
        if result['success']:
            serializer = self.get_serializer(payment)
            return Response(serializer.data)
        else:
            return Response(
                {'error': result.get('error', 'Status update failed')},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel payment"""
        payment = self.get_object()
        
        if payment.status not in ['PENDING', 'COMPLETED']:
            return Response(
                {'error': 'Payment cannot be cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cancel payment
        from apps.payments.services.payment_service import PaymentService
        result = PaymentService.update_payment_status(
            payment=payment,
            new_status='CANCELLED',
            user=request.user
        )
        
        if result['success']:
            serializer = self.get_serializer(payment)
            return Response(serializer.data)
        else:
            return Response(
                {'error': result.get('error', 'Cancellation failed')},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['get'])
    def receipt(self, request, pk=None):
        """Download payment receipt PDF"""
        from django.http import FileResponse, HttpResponse
        
        payment = self.get_object()
        
        # Check if receipt exists
        if not hasattr(payment, 'receipt'):
            return Response(
                {'error': 'Receipt not found for this payment'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        receipt = payment.receipt
        
        # Check if PDF exists
        if not receipt.has_pdf():
            # Generate PDF
            from apps.payments.services.receipt_pdf_service import ReceiptPDFService
            result = ReceiptPDFService.generate_receipt_pdf(receipt)
            
            if not result['success']:
                return Response(
                    {'error': 'Failed to generate receipt PDF'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        # Return PDF file
        pdf_file = receipt.pdf_file
        pdf_file.open('rb')
        
        response = FileResponse(
            pdf_file,
            content_type='application/pdf'
        )
        response['Content-Disposition'] = f'attachment; filename="{receipt.receipt_number}.pdf"'
        
        return response
```

### Expected Outcome
- PaymentViewSet with CRUD operations
- Custom queryset with optimizations
- Different serializers for different actions
- complete/cancel/receipt actions

### Verification Checklist
- [ ] PaymentViewSet created
- [ ] get_queryset() with tenant filtering
- [ ] get_serializer_class() for different actions
- [ ] perform_destroy() validation
- [ ] complete action
- [ ] cancel action
- [ ] receipt action (PDF download)
- [ ] Permission classes configured
- [ ] Queryset optimizations (select_related, prefetch_related)

---

## Task 81: Implement Payment Filtering

### Overview
Create django-filter FilterSet for filtering payments by method, status, date range, customer, and amount.

### Dependencies
- django-filter installed
- PaymentViewSet exists

### Instructions

1. **Create PaymentFilter**
   - Filter by method (multiple)
   - Filter by status (multiple)
   - Filter by date range (payment_date)
   - Filter by customer
   - Filter by amount range
   - Filter by currency

2. **Add custom filters**
   - has_receipt filter
   - overdue filter (for invoices)

3. **Configure in ViewSet**
   - Add filter_backends
   - Set filterset_class

### Implementation

```python
# Create apps/payments/filters.py

import django_filters
from django.db.models import Q
from datetime import date

from apps.payments.models import Payment, Refund, PaymentPlan


class PaymentFilter(django_filters.FilterSet):
    """Filter for Payment model"""
    
    # Method filter (multiple)
    method = django_filters.MultipleChoiceFilter(
        choices=Payment.PAYMENT_METHOD_CHOICES,
        help_text='Filter by payment method (can select multiple)'
    )
    
    # Status filter (multiple)
    status = django_filters.MultipleChoiceFilter(
        choices=Payment.PAYMENT_STATUS_CHOICES,
        help_text='Filter by payment status (can select multiple)'
    )
    
    # Date range filters
    payment_date_from = django_filters.DateFilter(
        field_name='payment_date',
        lookup_expr='gte',
        help_text='Filter payments from this date (inclusive)'
    )
    payment_date_to = django_filters.DateFilter(
        field_name='payment_date',
        lookup_expr='lte',
        help_text='Filter payments up to this date (inclusive)'
    )
    
    # Amount range filters
    amount_min = django_filters.NumberFilter(
        field_name='amount',
        lookup_expr='gte',
        help_text='Minimum payment amount'
    )
    amount_max = django_filters.NumberFilter(
        field_name='amount',
        lookup_expr='lte',
        help_text='Maximum payment amount'
    )
    
    # Customer filter
    customer = django_filters.NumberFilter(
        field_name='customer_id',
        help_text='Filter by customer ID'
    )
    customer_name = django_filters.CharFilter(
        field_name='customer__name',
        lookup_expr='icontains',
        help_text='Filter by customer name (case-insensitive partial match)'
    )
    
    # Invoice filter
    invoice = django_filters.NumberFilter(
        field_name='invoice_id',
        help_text='Filter by invoice ID'
    )
    invoice_number = django_filters.CharFilter(
        field_name='invoice__invoice_number',
        lookup_expr='icontains',
        help_text='Filter by invoice number'
    )
    
    # Currency filter
    currency = django_filters.CharFilter(
        help_text='Filter by currency code (e.g., LKR, USD)'
    )
    
    # Receipt filter
    has_receipt = django_filters.BooleanFilter(
        method='filter_has_receipt',
        help_text='Filter payments with/without receipts'
    )
    
    # Refund status filter
    refund_status = django_filters.ChoiceFilter(
        choices=[
            ('NONE', 'No Refunds'),
            ('PARTIAL', 'Partially Refunded'),
            ('FULL', 'Fully Refunded'),
        ],
        help_text='Filter by refund status'
    )
    
    # Search filter (combines multiple fields)
    search = django_filters.CharFilter(
        method='filter_search',
        help_text='Search in payment number, reference number, customer name'
    )
    
    class Meta:
        model = Payment
        fields = [
            'method',
            'status',
            'payment_date_from',
            'payment_date_to',
            'amount_min',
            'amount_max',
            'customer',
            'customer_name',
            'invoice',
            'invoice_number',
            'currency',
            'has_receipt',
            'refund_status',
            'search',
        ]
    
    def filter_has_receipt(self, queryset, name, value):
        """Filter payments with/without receipts"""
        if value:
            return queryset.filter(receipt__isnull=False)
        else:
            return queryset.filter(receipt__isnull=True)
    
    def filter_search(self, queryset, name, value):
        """Search across multiple fields"""
        return queryset.filter(
            Q(payment_number__icontains=value) |
            Q(reference_number__icontains=value) |
            Q(customer__name__icontains=value)
        )


class RefundFilter(django_filters.FilterSet):
    """Filter for Refund model"""
    
    # Status filter
    status = django_filters.MultipleChoiceFilter(
        choices=Refund.REFUND_STATUS_CHOICES,
        help_text='Filter by refund status'
    )
    
    # Reason filter
    reason = django_filters.MultipleChoiceFilter(
        choices=Refund.REFUND_REASON_CHOICES,
        help_text='Filter by refund reason'
    )
    
    # Date filters
    requested_from = django_filters.DateFilter(
        field_name='requested_at',
        lookup_expr='gte'
    )
    requested_to = django_filters.DateFilter(
        field_name='requested_at',
        lookup_expr='lte'
    )
    
    # Customer filter
    customer = django_filters.NumberFilter(field_name='customer_id')
    customer_name = django_filters.CharFilter(
        field_name='customer__name',
        lookup_expr='icontains'
    )
    
    # Amount filter
    amount_min = django_filters.NumberFilter(
        field_name='refund_amount',
        lookup_expr='gte'
    )
    amount_max = django_filters.NumberFilter(
        field_name='refund_amount',
        lookup_expr='lte'
    )
    
    class Meta:
        model = Refund
        fields = [
            'status',
            'reason',
            'requested_from',
            'requested_to',
            'customer',
            'customer_name',
            'amount_min',
            'amount_max',
        ]


class PaymentPlanFilter(django_filters.FilterSet):
    """Filter for PaymentPlan model"""
    
    # Status filter
    status = django_filters.MultipleChoiceFilter(
        choices=PaymentPlan.PLAN_STATUS_CHOICES
    )
    
    # Customer filter
    customer = django_filters.NumberFilter(field_name='customer_id')
    
    # Date filters
    start_date_from = django_filters.DateFilter(
        field_name='start_date',
        lookup_expr='gte'
    )
    start_date_to = django_filters.DateFilter(
        field_name='start_date',
        lookup_expr='lte'
    )
    
    # Overdue filter
    has_overdue = django_filters.BooleanFilter(
        method='filter_has_overdue'
    )
    
    class Meta:
        model = PaymentPlan
        fields = [
            'status',
            'customer',
            'start_date_from',
            'start_date_to',
            'has_overdue',
        ]
    
    def filter_has_overdue(self, queryset, name, value):
        """Filter plans with overdue installments"""
        today = date.today()
        
        if value:
            return queryset.filter(
                installments__status='OVERDUE'
            ).distinct()
        else:
            return queryset.exclude(
                installments__status='OVERDUE'
            ).distinct()
```

### Usage Examples

```python
# In ViewSet
class PaymentViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = PaymentFilter
```

```
# Example API calls:
GET /api/v1/payments/?method=CASH&method=CARD&status=COMPLETED
GET /api/v1/payments/?payment_date_from=2026-01-01&payment_date_to=2026-01-31
GET /api/v1/payments/?amount_min=10000&amount_max=50000&currency=LKR
GET /api/v1/payments/?customer=123&has_receipt=true
GET /api/v1/payments/?search=INV-2026-00123
```

### Expected Outcome
- PaymentFilter with comprehensive filtering
- RefundFilter for refund filtering
- PaymentPlanFilter for payment plan filtering
- Multiple filters combinable

### Verification Checklist
- [ ] PaymentFilter created
- [ ] Method filter (multiple)
- [ ] Status filter (multiple)
- [ ] Date range filters
- [ ] Amount range filters
- [ ] Customer filters
- [ ] has_receipt filter
- [ ] search filter
- [ ] RefundFilter created
- [ ] PaymentPlanFilter created
- [ ] Filters registered in ViewSets

---

## Task 82: Add Payment Actions

### Overview
Add custom actions to PaymentViewSet for recording payments with different methods (cash, card, bank transfer, mobile, split payment).

### Dependencies
- PaymentViewSet exists
- PaymentService implemented

### Instructions

1. **Add record_cash action**
   - Accept cash payment data
   - Calculate change
   - Use PaymentService

2. **Add record_card action**
   - Accept card details
   - Validate card info

3. **Add record_transfer action**
   - Accept bank transfer details

4. **Add record_mobile action**
   - Accept mobile payment details

5. **Add record_split action**
   - Accept multiple payment methods

### Implementation

```python
# Update apps/payments/views/payment_viewset.py

from rest_framework import serializers as drf_serializers


class PaymentViewSet(viewsets.ModelViewSet):
    # ... (previous code) ...
    
    @action(detail=False, methods=['post'])
    def record_cash(self, request):
        """
        Record cash payment
        
        Request body:
        {
            "customer": 123,
            "invoice": 456,  // or "order": 789
            "amount": "50000.00",
            "currency": "LKR",
            "payment_date": "2026-01-15",
            "cash_received": "55000.00",  // optional
            "notes": "Payment for invoice INV-2026-00456"
        }
        """
        from apps.payments.services.payment_service import PaymentService
        
        # Validate required fields
        required_fields = ['customer', 'amount']
        for field in required_fields:
            if field not in request.data:
                return Response(
                    {'error': f'{field} is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # At least invoice or order required
        if 'invoice' not in request.data and 'order' not in request.data:
            return Response(
                {'error': 'Either invoice or order is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prepare data
        data = request.data.copy()
        data['method'] = 'CASH'
        data['received_by'] = request.user
        
        # Record payment
        result = PaymentService.record_cash_payment(data)
        
        if result['success']:
            payment = result['payment']
            serializer = PaymentDetailSerializer(payment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {'error': result.get('error', 'Payment recording failed')},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'])
    def record_card(self, request):
        """
        Record card payment
        
        Request body:
        {
            "customer": 123,
            "invoice": 456,
            "amount": "75000.00",
            "currency": "LKR",
            "payment_date": "2026-01-15",
            "card_type": "VISA",
            "last_4_digits": "1234",
            "approval_code": "ABC123",
            "transaction_id": "TXN789456"
        }
        """
        from apps.payments.services.payment_service import PaymentService
        
        # Validate card-specific fields
        card_fields = ['card_type', 'last_4_digits']
        for field in card_fields:
            if field not in request.data:
                return Response(
                    {'error': f'{field} is required for card payments'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Prepare data
        data = request.data.copy()
        data['method'] = 'CARD'
        data['received_by'] = request.user
        
        # Extract method_details
        data['method_details'] = {
            'card_type': data.get('card_type'),
            'last_4_digits': data.get('last_4_digits'),
            'approval_code': data.get('approval_code'),
            'transaction_id': data.get('transaction_id'),
        }
        
        # Record payment
        result = PaymentService.record_card_payment(data)
        
        if result['success']:
            payment = result['payment']
            serializer = PaymentDetailSerializer(payment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {'error': result.get('error', 'Payment recording failed')},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'])
    def record_transfer(self, request):
        """
        Record bank transfer payment
        
        Request body:
        {
            "customer": 123,
            "invoice": 456,
            "amount": "100000.00",
            "currency": "LKR",
            "payment_date": "2026-01-15",
            "bank_name": "Commercial Bank",
            "account_number": "1234567890",
            "reference_number": "REF123456",
            "verified": false
        }
        """
        from apps.payments.services.payment_service import PaymentService
        
        # Validate bank transfer fields
        if 'bank_name' not in request.data:
            return Response(
                {'error': 'bank_name is required for bank transfers'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prepare data
        data = request.data.copy()
        data['method'] = 'BANK_TRANSFER'
        data['received_by'] = request.user
        
        # Extract method_details
        data['method_details'] = {
            'bank_name': data.get('bank_name'),
            'account_number': data.get('account_number'),
            'verified': data.get('verified', False),
        }
        
        # Record payment
        result = PaymentService.record_bank_transfer(data)
        
        if result['success']:
            payment = result['payment']
            serializer = PaymentDetailSerializer(payment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {'error': result.get('error', 'Payment recording failed')},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'])
    def record_mobile(self, request):
        """
        Record mobile payment (FriMi, eZ Cash, mCash, Genie)
        
        Request body:
        {
            "customer": 123,
            "invoice": 456,
            "amount": "25000.00",
            "currency": "LKR",
            "payment_date": "2026-01-15",
            "provider": "FriMi",
            "mobile_number": "0771234567",
            "transaction_id": "FRM123456789"
        }
        """
        from apps.payments.services.payment_service import PaymentService
        
        # Validate mobile payment fields
        mobile_fields = ['provider', 'mobile_number']
        for field in mobile_fields:
            if field not in request.data:
                return Response(
                    {'error': f'{field} is required for mobile payments'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Prepare data
        data = request.data.copy()
        data['method'] = 'MOBILE'
        data['received_by'] = request.user
        
        # Extract method_details
        data['method_details'] = {
            'provider': data.get('provider'),
            'mobile_number': data.get('mobile_number'),
            'transaction_id': data.get('transaction_id'),
        }
        
        # Record payment
        result = PaymentService.record_mobile_payment(data)
        
        if result['success']:
            payment = result['payment']
            serializer = PaymentDetailSerializer(payment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {'error': result.get('error', 'Payment recording failed')},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'])
    def record_split(self, request):
        """
        Record split payment (multiple methods)
        
        Request body:
        {
            "customer": 123,
            "invoice": 456,
            "total_amount": "100000.00",
            "currency": "LKR",
            "payment_date": "2026-01-15",
            "parts": [
                {
                    "method": "CASH",
                    "amount": "50000.00"
                },
                {
                    "method": "CARD",
                    "amount": "50000.00",
                    "method_details": {
                        "card_type": "VISA",
                        "last_4_digits": "1234"
                    }
                }
            ]
        }
        """
        from apps.payments.services.payment_service import PaymentService
        
        # Validate split payment data
        if 'parts' not in request.data or not request.data['parts']:
            return Response(
                {'error': 'parts array is required for split payments'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(request.data['parts']) < 2:
            return Response(
                {'error': 'At least 2 payment parts required for split payment'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prepare data
        data = request.data.copy()
        data['received_by'] = request.user
        
        # Record split payment
        result = PaymentService.record_split_payment(data)
        
        if result['success']:
            split_payment = result['split_payment']
            return Response({
                'split_payment_number': split_payment.split_payment_number,
                'total_amount': str(split_payment.total_amount),
                'parts': [
                    {
                        'method': part.method,
                        'amount': str(part.amount),
                        'payment_number': part.payment.payment_number
                    }
                    for part in split_payment.parts.all()
                ],
                'message': 'Split payment recorded successfully'
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {'error': result.get('error', 'Split payment recording failed')},
                status=status.HTTP_400_BAD_REQUEST
            )
```

### API Endpoints

```
POST /api/v1/payments/record_cash/
POST /api/v1/payments/record_card/
POST /api/v1/payments/record_transfer/
POST /api/v1/payments/record_mobile/
POST /api/v1/payments/record_split/
```

### Expected Outcome
- Custom actions for each payment method
- Method-specific validation
- Integration with PaymentService
- Proper error handling

### Verification Checklist
- [ ] record_cash action
- [ ] record_card action
- [ ] record_transfer action
- [ ] record_mobile action
- [ ] record_split action
- [ ] Method-specific validation
- [ ] PaymentService integration
- [ ] Error responses
- [ ] Success responses with serialized data

---

## Task 83: Create Payment Reports Endpoint

### Overview
Create API endpoint for payment reports, including payment summary, reconciliation report, and payment analytics.

### Dependencies
- PaymentViewSet exists

### Instructions

1. **Create PaymentReportView**
   - Summary report (total by method, status)
   - Daily/weekly/monthly totals
   - Outstanding payments report

2. **Add reconciliation report**
   - Match payments with invoices
   - Identify discrepancies

3. **Add payment analytics**
   - Top customers by payment
   - Payment trends

### Implementation

```python
# Create apps/payments/views/report_views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q, F
from django.db.models.functions import TruncDate, TruncMonth
from datetime import datetime, timedelta
from decimal import Decimal

from apps.payments.models import Payment
from apps.core.permissions import IsTenantUser


class PaymentReportView(APIView):
    """API view for payment reports and analytics"""
    
    permission_classes = [IsAuthenticated, IsTenantUser]
    
    def get(self, request):
        """
        Get payment reports
        
        Query params:
        - report_type: summary, daily, monthly, reconciliation, analytics
        - date_from: Start date (YYYY-MM-DD)
        - date_to: End date (YYYY-MM-DD)
        - currency: Currency code (default: LKR)
        """
        report_type = request.query_params.get('report_type', 'summary')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        currency = request.query_params.get('currency', 'LKR')
        
        # Parse dates
        if date_from:
            date_from = datetime.strptime(date_from, '%Y-%m-%d').date()
        else:
            date_from = datetime.now().date() - timedelta(days=30)
        
        if date_to:
            date_to = datetime.strptime(date_to, '%Y-%m-%d').date()
        else:
            date_to = datetime.now().date()
        
        # Get base queryset
        payments = Payment.objects.filter(
            tenant=request.user.tenant,
            payment_date__gte=date_from,
            payment_date__lte=date_to,
            currency=currency
        )
        
        # Route to appropriate report
        if report_type == 'summary':
            return self._payment_summary(payments, currency)
        elif report_type == 'daily':
            return self._daily_report(payments, currency)
        elif report_type == 'monthly':
            return self._monthly_report(payments, currency)
        elif report_type == 'reconciliation':
            return self._reconciliation_report(payments, date_from, date_to)
        elif report_type == 'analytics':
            return self._payment_analytics(payments, currency)
        else:
            return Response({'error': 'Invalid report_type'}, status=400)
    
    def _payment_summary(self, payments, currency):
        """Payment summary by method and status"""
        
        # Total by method
        by_method = payments.values('method').annotate(
            total_amount=Sum('amount'),
            count=Count('id')
        ).order_by('method')
        
        # Total by status
        by_status = payments.values('status').annotate(
            total_amount=Sum('amount'),
            count=Count('id')
        ).order_by('status')
        
        # Grand total
        totals = payments.aggregate(
            total_amount=Sum('amount'),
            total_count=Count('id'),
            completed_amount=Sum('amount', filter=Q(status='COMPLETED')),
            pending_amount=Sum('amount', filter=Q(status='PENDING')),
        )
        
        return Response({
            'summary': {
                'by_method': list(by_method),
                'by_status': list(by_status),
                'totals': totals,
                'currency': currency
            }
        })
    
    def _daily_report(self, payments, currency):
        """Daily payment totals"""
        
        daily_totals = payments.annotate(
            date=TruncDate('payment_date')
        ).values('date').annotate(
            total_amount=Sum('amount'),
            count=Count('id')
        ).order_by('date')
        
        return Response({
            'daily_report': list(daily_totals),
            'currency': currency
        })
    
    def _monthly_report(self, payments, currency):
        """Monthly payment totals"""
        
        monthly_totals = payments.annotate(
            month=TruncMonth('payment_date')
        ).values('month').annotate(
            total_amount=Sum('amount'),
            count=Count('id')
        ).order_by('month')
        
        return Response({
            'monthly_report': list(monthly_totals),
            'currency': currency
        })
    
    def _reconciliation_report(self, payments, date_from, date_to):
        """Payment reconciliation report"""
        from apps.invoices.models import Invoice
        
        # Payments without invoices
        payments_no_invoice = payments.filter(
            invoice__isnull=True,
            order__isnull=True
        ).values('payment_number', 'amount', 'customer__name')
        
        # Invoices with payment mismatches
        invoices = Invoice.objects.filter(
            tenant=payments.first().tenant if payments.exists() else None,
            invoice_date__gte=date_from,
            invoice_date__lte=date_to
        ).annotate(
            payment_total=Sum('payments__amount', filter=Q(payments__status='COMPLETED'))
        ).filter(
            ~Q(payment_total=F('paid_amount'))
        )
        
        mismatches = invoices.values(
            'invoice_number',
            'total_amount',
            'paid_amount',
            'payment_total'
        )
        
        return Response({
            'reconciliation': {
                'payments_without_invoice': list(payments_no_invoice),
                'invoice_payment_mismatches': list(mismatches),
            }
        })
    
    def _payment_analytics(self, payments, currency):
        """Payment analytics"""
        
        # Top customers
        top_customers = payments.filter(
            status='COMPLETED'
        ).values(
            'customer__id',
            'customer__name'
        ).annotate(
            total_paid=Sum('amount'),
            payment_count=Count('id')
        ).order_by('-total_paid')[:10]
        
        # Payment method distribution
        method_distribution = payments.filter(
            status='COMPLETED'
        ).values('method').annotate(
            total=Sum('amount'),
            count=Count('id')
        )
        
        # Average payment by method
        avg_by_method = payments.filter(
            status='COMPLETED'
        ).values('method').annotate(
            avg_amount=Sum('amount') / Count('id')
        )
        
        return Response({
            'analytics': {
                'top_customers': list(top_customers),
                'method_distribution': list(method_distribution),
                'average_by_method': list(avg_by_method),
                'currency': currency
            }
        })
```

### API Usage

```bash
# Payment summary
GET /api/v1/payments/reports/?report_type=summary&date_from=2026-01-01&date_to=2026-01-31&currency=LKR

# Daily report
GET /api/v1/payments/reports/?report_type=daily&date_from=2026-01-01&date_to=2026-01-31

# Monthly report
GET /api/v1/payments/reports/?report_type=monthly&date_from=2026-01-01&date_to=2026-12-31

# Reconciliation
GET /api/v1/payments/reports/?report_type=reconciliation&date_from=2026-01-01&date_to=2026-01-31

# Analytics
GET /api/v1/payments/reports/?report_type=analytics&date_from=2026-01-01&date_to=2026-01-31
```

### Expected Outcome
- Payment summary report
- Daily/monthly reports
- Reconciliation report
- Payment analytics

### Verification Checklist
- [ ] PaymentReportView created
- [ ] Summary report (_payment_summary)
- [ ] Daily report (_daily_report)
- [ ] Monthly report (_monthly_report)
- [ ] Reconciliation report (_reconciliation_report)
- [ ] Analytics report (_payment_analytics)
- [ ] Date filtering
- [ ] Currency filtering
- [ ] Proper aggregations

---

## Summary

This document completed API implementation for payment operations:

1. ✅ **PaymentSerializer** (Task 77): Full, list, detail, and create serializers with validation
2. ✅ **RefundSerializer** (Task 78): Refund serializers with approval/rejection
3. ✅ **PaymentListSerializer** (Task 79): Lightweight serializer for lists
4. ✅ **PaymentViewSet** (Task 80): CRUD operations with custom actions (complete, cancel, receipt)
5. ✅ **Payment Filtering** (Task 81): Comprehensive filters by method, status, date, amount, customer
6. ✅ **Payment Actions** (Task 82): Method-specific recording actions (cash, card, transfer, mobile, split)
7. ✅ **Payment Reports** (Task 83): Summary, daily, monthly, reconciliation, and analytics reports

**Key Features Implemented:**
- Full CRUD operations for payments
- Method-specific payment recording endpoints
- Advanced filtering and search
- Receipt PDF download
- Payment reports and analytics
- Refund management API
- Proper validation and error handling

**Next Document:** [02_Tasks-84-86_URLs-Tests-Documentation.md](02_Tasks-84-86_URLs-Tests-Documentation.md) - URL registration, comprehensive tests, and API documentation.
